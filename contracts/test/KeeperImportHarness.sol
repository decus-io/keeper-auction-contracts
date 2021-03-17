// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../interfaces/IKeeperImport.sol";

contract KeeperImportHarness is IKeeperImport {
    address[] public keepers;

    function importKeepers(
        address _from,
        address[] calldata _assets,
        address[] calldata _keepers,
        uint256[] calldata _keeper_amounts
    ) external override {
        // check keeper amounts
        uint256[] memory _sum_amounts = new uint256[](_assets.length);
        for (uint256 i = 0; i < _keepers.length; i++) {
            uint256 base = i * _assets.length;
            for (uint256 j = 0; j < _assets.length; j++) {
                _sum_amounts[j] = _sum_amounts[j] + _keeper_amounts[base + j];
            }
        }

        for (uint256 i = 0; i < _assets.length; i++) {
            if (_sum_amounts[i] == 0) {
                continue;
            }
            IERC20 token = IERC20(_assets[i]);
            require(
                token.transferFrom(_from, address(this), _sum_amounts[i]),
                "KeeperHolderHarness:add: transferFrom fail"
            );
        }
        keepers = _keepers;
    }

    function keeperSize() public view returns (uint256) {
        return keepers.length;
    }
}
