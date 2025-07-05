const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PayPerViewDeploymentV2", (m) => {
  const payPerView = m.contract("PayPerView");
  
  return { payPerView };
}); 