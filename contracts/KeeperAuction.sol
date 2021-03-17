// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./interfaces/IKeeperImport.sol";

contract KeeperAuction is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    struct Token {
        bool exist;
        address token;
        uint8 decimals;
        uint256 index;
    }

    struct Bid {
        address owner;
        bool live;
        uint256 index;
        address token;
        uint256 amount;
        uint256 vAmount;
        uint256 selectedAmount;
    }

    struct UserBids {
        bool selected;
        uint256 amount;
        uint256[] bids;
    }

    struct SelectedToken {
        address token;
        uint256 amount;
    }

    event Bidded(address indexed owner, uint256 index, address indexed token, uint256 amount);
    event Canceled(address indexed owner, uint256 index, address indexed token, uint256 amount);
    event Refund(address indexed owner, uint256 index, address indexed token, uint256 amount);
    event EndLocked(address keeperImport, uint256 deadline);
    event AuctionEnd(address[] tokens, uint256[] amount, address[] keepers);
    event AuctionFailed();

    mapping(address => Token) public tokens;
    mapping(address => UserBids) public userBids;
    Bid[] public bids;
    address[] public bidders;
    uint256 public deadline;
    SelectedToken[] public selectedTokens;
    IKeeperImport public keeperImport;
    bool public ended;

    uint256 public MIN_AMOUNT;
    uint256 public constant DECIMALS = 8;

    // timelock
    uint256 public MINIMUM_DELAY;
    uint256 public constant MAXIMUM_DELAY = 5 days;

    function initialize(
        address[] memory _tokens,
        uint256 _delay,
        uint256 minAmount
    ) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();

        require(_delay > 0 && _delay < MAXIMUM_DELAY, "KeeperAuction::initialize: delay illegal");
        deadline = 9999999999;
        MINIMUM_DELAY = _delay;
        MIN_AMOUNT = minAmount;
        ended = false;
        for (uint8 i = 0; i < _tokens.length; i++) {
            uint8 decimals = ERC20(_tokens[i]).decimals();
            require(
                decimals >= DECIMALS,
                "KeeperAuction::initialize: token decimal need greater default decimal"
            );
            tokens[_tokens[i]] = Token(true, _tokens[i], decimals, i);
            selectedTokens.push(SelectedToken(_tokens[i], 0));
        }
    }

    function bid(address _token, uint256 _amount) public nonReentrant {
        require(biddable(), "KeeperAuction::bid: stop bid");

        Token storage vToken = tokens[_token];
        require(vToken.exist, "KeeperAuction::bid: Unknown token");

        uint256 vAmount = _amount;
        uint256 decimals = vToken.decimals;
        uint256 _checkMod = MIN_AMOUNT;
        if (decimals > DECIMALS) {
            vAmount = _amount.div(10**(decimals - DECIMALS));
            _checkMod = _checkMod.mul(10**(decimals - DECIMALS));
        }
        require(_amount.mod(_checkMod) == 0, "KeeperAuction::bid: amount illegal");

        ERC20 token = ERC20(_token);
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "KeeperAuction::bid: transferFrom fail"
        );

        UserBids storage _userBids = userBids[msg.sender];
        uint256 cIndex = bids.length;
        bids.push(Bid(msg.sender, true, cIndex, _token, _amount, vAmount, 0));
        if (_userBids.bids.length == 0) {
            bidders.push(msg.sender);
        }
        _userBids.selected = false;
        _userBids.amount = _userBids.amount.add(vAmount);
        _userBids.bids.push(cIndex);
        emit Bidded(msg.sender, cIndex, _token, _amount);
    }

    function cancel(uint256 _index) public nonReentrant {
        require(withdrawable(), "KeeperAuction::cancel: can't cancel before end");
        require(bids.length > _index, "KeeperAuction::cancel: Unknown bid index");
        Bid storage _bid = bids[_index];
        require(_bid.live, "KeeperAuction::cancel: Bid already canceled");
        require(msg.sender == _bid.owner, "KeeperAuction::cancel: Only owner can cancel");

        ERC20 token = ERC20(_bid.token);
        uint256 cancelAmount = _bid.amount.sub(_bid.selectedAmount);
        require(cancelAmount > 0, "KeeperAuction::cancel: zero amount");
        require(
            token.transfer(msg.sender, cancelAmount),
            "KeeperAuction::cancel: Transfer back fail"
        );
        _bid.live = false;
        UserBids storage _userBids = userBids[msg.sender];
        _userBids.amount = _userBids.amount.sub(_bid.vAmount);
        emit Canceled(msg.sender, _bid.index, _bid.token, cancelAmount);
    }

    function refund() public nonReentrant {
        require(withdrawable(), "KeeperAuction::cancel: can't cancel before end");
        uint256[] storage _userBids = userBids[msg.sender].bids;
        for (uint256 i = 0; i < _userBids.length; i++) {
            Bid storage _bid = bids[_userBids[i]];
            if (!_bid.live) {
                continue;
            }

            uint256 refundAmount = _bid.amount.sub(_bid.selectedAmount);
            if (refundAmount == 0) {
                continue;
            }
            ERC20 token = ERC20(_bid.token);
            require(
                token.transfer(msg.sender, refundAmount),
                "KeeperAuction::refund: Transfer back fail"
            );
            _bid.live = false;
            emit Refund(msg.sender, _bid.index, _bid.token, refundAmount);
        }
        userBids[msg.sender].amount = 0;
    }

    function getBid(uint256 _index)
        public
        view
        returns (
            address owner,
            bool live,
            uint256 index,
            address token,
            uint256 amount,
            uint256 vAmount,
            uint256 selectedAmount
        )
    {
        Bid storage _bid = bids[_index];
        return (
            _bid.owner,
            _bid.live,
            _bid.index,
            _bid.token,
            _bid.amount,
            _bid.vAmount,
            _bid.selectedAmount
        );
    }

    function bidderAmount(address bidder) public view returns (uint256) {
        return userBids[bidder].amount;
    }

    function userBidsIndex(address bidder) public view returns (uint256[] memory) {
        return userBids[bidder].bids;
    }

    function bidderCount() public view returns (uint256) {
        return bidders.length;
    }

    function bidCount() public view returns (uint256) {
        return bids.length;
    }

    function biddable() public view returns (bool) {
        return deadline > block.timestamp;
    }

    function withdrawable() public view returns (bool) {
        return !((block.timestamp > deadline) && !ended);
    }

    function cancelable(uint256 _index) public view returns (bool) {
        if (!withdrawable()) {
            return false;
        }
        Bid storage _bid = bids[_index];
        return _bid.live && _bid.amount.sub(_bid.selectedAmount) > 0;
    }

    // Owner operations
    function lockEnd(IKeeperImport _keeperImport, uint256 _deadline) public onlyOwner {
        require(
            getBlockTimestamp() <= _deadline.sub(MINIMUM_DELAY),
            "KeeperAuction::lockEnd: deadline error"
        );
        require(
            getBlockTimestamp() >= _deadline.sub(MAXIMUM_DELAY),
            "KeeperAuction::lockEnd: deadline too large"
        );

        keeperImport = _keeperImport;
        deadline = _deadline;
        emit EndLocked(address(_keeperImport), _deadline);
    }

    function end(address[] memory keepers) public onlyOwner {
        require(!ended, "KeeperAuction::end: already ended");
        require(getBlockTimestamp() >= deadline, "KeeperAuction::end: can't end before deadline");
        require(keepers.length > 0, "KeeperAuction::end: at least one position");

        uint256 min = userBids[keepers[0]].amount;
        for (uint256 i = 0; i < keepers.length; i++) {
            UserBids storage _userBids = userBids[keepers[i]];
            _userBids.selected = true;
            if (_userBids.amount < min) {
                min = _userBids.amount;
            }
        }
        require(min > 0, "KeeperAuction::end: min keeper amount is zero");

        for (uint256 i = 0; i < bidders.length; i++) {
            UserBids storage _userBids = userBids[bidders[i]];
            require(
                _userBids.amount <= min || _userBids.selected,
                "KeeperAuction::end: error selected keepers"
            );
        }

        uint256[] memory _keeperAmounts = new uint256[](keepers.length * selectedTokens.length);

        for (uint256 i = 0; i < keepers.length; i++) {
            uint256 remainAmount = min;
            UserBids storage _userBids = userBids[keepers[i]];
            _userBids.amount = _userBids.amount.sub(min);
            uint256[] storage _bid_indexes = _userBids.bids;

            uint256 _base = i * selectedTokens.length;

            for (uint256 j = 0; j < _bid_indexes.length; j++) {
                uint256 _index = _bid_indexes[j];
                Bid storage _bid = bids[_index];
                if (!_bid.live) {
                    continue;
                }
                Token storage token = tokens[_bid.token];
                uint256 itemAmount = 0;
                if (_bid.vAmount >= remainAmount) {
                    itemAmount = remainAmount;
                    remainAmount = 0;
                } else {
                    itemAmount = _bid.vAmount;
                    remainAmount = remainAmount.sub(_bid.vAmount);
                }
                if (token.decimals > DECIMALS) {
                    itemAmount = itemAmount.mul(10**(token.decimals - DECIMALS));
                }
                _bid.selectedAmount = itemAmount;
                selectedTokens[token.index].amount = selectedTokens[token.index].amount.add(
                    itemAmount
                );
                _keeperAmounts[_base + token.index] = _keeperAmounts[_base + token.index].add(
                    itemAmount
                );

                if (remainAmount == 0) {
                    break;
                }
            }
        }

        address[] memory _tokens = new address[](selectedTokens.length);
        uint256[] memory _amounts = new uint256[](selectedTokens.length);
        for (uint256 i = 0; i < selectedTokens.length; i++) {
            ERC20 token = ERC20(selectedTokens[i].token);
            _tokens[i] = selectedTokens[i].token;
            _amounts[i] = selectedTokens[i].amount;
            require(
                token.approve(address(keeperImport), selectedTokens[i].amount),
                "KeeperAuction::end: approve fail"
            );
        }
        keeperImport.importKeepers(address(this), _tokens, keepers, _keeperAmounts);
        ended = true;
        emit AuctionEnd(_tokens, _amounts, keepers);
    }

    function fail() public onlyOwner {
        require(!ended, "KeeperAuction::fail: already ended");
        require(getBlockTimestamp() >= deadline, "KeeperAuction::fail: can't end before deadline");
        ended = true;

        emit AuctionFailed();
    }

    function getBlockTimestamp() public view returns (uint256) {
        // solium-disable-next-line security/no-block-members
        return block.timestamp;
    }
}
