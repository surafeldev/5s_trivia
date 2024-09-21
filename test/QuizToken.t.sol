// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/QuizToken.sol";

contract QuizTokenTest is Test {
    QuizToken token;

    function setUp() public {
        token = new QuizToken();
    }

    function testInitialSupply() public {
        uint256 expectedSupply = 1000 * 10 ** token.decimals();
        assertEq(token.totalSupply(), expectedSupply);
    }

    function testTokenName() public {
        assertEq(token.name(), "QuizToken");
    }

    function testTokenSymbol() public {
        assertEq(token.symbol(), "QT");
    }

    function testTransfer() public {
        address recipient = address(0x123);
        uint256 amount = 100 * 10 ** token.decimals();
        token.transfer(recipient, amount);
        assertEq(token.balanceOf(recipient), amount);
    }

    function testApproveAndTransferFrom() public {
        address spender = address(0x456);
        uint256 amount = 50 * 10 ** token.decimals();
        token.approve(spender, amount);
        assertEq(token.allowance(address(this), spender), amount);

        token.transferFrom(address(this), spender, amount);
        assertEq(token.balanceOf(spender), amount);
    }

    function testBurn() public {
        uint256 burnAmount = 10 * 10 ** token.decimals();
        token.burn(burnAmount);
        uint256 expectedSupply = (1000 * 10 ** token.decimals()) - burnAmount;
        assertEq(token.totalSupply(), expectedSupply);
    }
}
