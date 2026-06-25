const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🐄 Desplegando Vaquitapp...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📍 Cuenta desplegadora:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy
  const Vaquitapp = await ethers.getContractFactory("Vaquitapp");
  const vaquitapp = await Vaquitapp.deploy();
  await vaquitapp.waitForDeployment();

  const address = await vaquitapp.getAddress();
  console.log("✅ Vaquitapp desplegado en:", address);

  // Guardar dirección en frontend
  const addressData = {
    address,
    network: "localhost",
    chainId: 1337,
    deployedAt: new Date().toISOString(),
  };

  const frontendPublicDir = path.join(__dirname, "../frontend/public");
  const frontendLibDir   = path.join(__dirname, "../frontend/lib");

  // Crear carpetas si no existen
  [frontendPublicDir, frontendLibDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Guardar dirección
  fs.writeFileSync(
    path.join(frontendPublicDir, "contract-address.json"),
    JSON.stringify(addressData, null, 2)
  );

  // Copiar ABI al frontend
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/Vaquitapp.sol/Vaquitapp.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  fs.writeFileSync(
    path.join(frontendLibDir, "abi.json"),
    JSON.stringify(artifact.abi, null, 2)
  );

  console.log("📁 contract-address.json → frontend/public/");
  console.log("📁 abi.json              → frontend/lib/\n");

  console.log("─────────────────────────────────────────────");
  console.log("🎉 ¡Listo! Ahora corrés el frontend:");
  console.log("   cd frontend && npm run dev");
  console.log("─────────────────────────────────────────────");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
