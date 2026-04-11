import { auditMemberSSOT, auditTraceability, cleanupRedundancies } from "./src/utils/dataIntegrity";

async function runVerification() {
  console.log("=== STARTING SSOT VERIFICATION ===");
  
  // 1. Audit Redundancy
  console.log("\n1. Auditing Redundant Fields...");
  const ssotIssues = await auditMemberSSOT();
  console.log(`Found ${ssotIssues.length} records with redundant fields.`);
  
  // 2. Perform Clean Break (Cleanup)
  if (ssotIssues.length > 0) {
    console.log("\n2. Performing Clean Break (Cleanup)...");
    const { updatedCount } = await cleanupRedundancies();
    console.log(`Cleaned up ${updatedCount} records.`);
  } else {
    console.log("\n2. No cleanup needed (System already clean).");
  }
  
  // 3. Re-Audit Traceability
  console.log("\n3. Auditing Traceability (Orphans)...");
  const tracerIssues = await auditTraceability();
  console.log(`Found ${tracerIssues.length} orphan records.`);
  
  console.log("\n=== VERIFICATION COMPLETE ===");
}

// In a real browser environment, this would be triggered from the UI.
// Here we just provide the script for reference or manual execution if the environment allowed.
console.log("Integrity check utility loaded.");
// runVerification(); 
