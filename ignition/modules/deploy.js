const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const _rewardAmount = 50 * 10 ** 18n;

module.exports = buildModule("QuizTokenModule", (m) => {
  const rewardAmount = m.getParameter("_rewardAmount", _rewardAmount);
  // const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);

  const lock = m.contract("QuizToken", [rewardAmount]);

  return { lock };
});
