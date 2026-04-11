
import { runSakEpRepair } from "../src/services/akuntansi/sakEpRepairService";

async function main() {
  console.log("🚀 Running SAK EP Repair Scratch Script...");
  try {
    const results = await runSakEpRepair();
    console.log("📊 Repair Results:", results);
  } catch (err) {
    console.error("💥 Repair Failed:", err);
  }
}

main();
