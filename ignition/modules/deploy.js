const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PayPerViewDeployment", (m) => {
  const payPerView = m.contract("PayPerView");
  
  return { payPerView };
}); 