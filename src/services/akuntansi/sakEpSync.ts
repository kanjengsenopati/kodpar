
/**
 * SAK EP (Entitas Privat) sync service
 */

export function batchSyncToSAKEP() {
  return {
    totalProcessed: 0,
    successful: 0,
    failed: 0
  };
}

export function validateTransactionSync() {
  return {
    syncPercentage: 100
  };
}
