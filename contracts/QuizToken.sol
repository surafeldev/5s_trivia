// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract QuizToken is ERC20 {

    uint256 public rewardAmount = 50*10**18;
    address public owner;
    
    mapping(address => uint256) public userStreak;

    event QuizCompleted(address indexed user, uint256 tokensAwarded);

    constructor() ERC20("QuizToken", "QUIZ") {
       owner = msg.sender;
        
    }

    // Function to reward users after they answer all questions correctly
    function rewardUser(address user) public {
        _mint(user, rewardAmount);
        emit QuizCompleted(user, rewardAmount);
    }

    // Function to allow users to spend tokens to retake the quiz
    function spendTokensForRetake() public {
        require(balanceOf(msg.sender) >= rewardAmount/2, "Insufficient tokens");
        _burn(msg.sender, rewardAmount/2);
    }

    // Function to set the reward amount
    function setRewardAmount(uint256 _rewardAmount) public onlyOwner {
        rewardAmount = _rewardAmount;
    }

    // Function to get the user's current token balance
    function getUserBalance(address user) external view returns (uint256) {
        return balanceOf(user);
    }

    //modifier for onlyowner
    modifier onlyOwner(){
        require(msg.sender == owner, "only owner can perform this.");
        _;
    }
}
