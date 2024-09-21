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
}
