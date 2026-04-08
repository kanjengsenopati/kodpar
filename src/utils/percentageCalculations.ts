
import { getJenisWithPercentage } from "@/services/jenisService";

// Calculate interest based on jenis percentage
export function calculateInterest(principal: number, jenisId: string, months: number = 1): number {
  const jenisData = getJenisWithPercentage(jenisId);
  if (!jenisData || !jenisData.bungaPersen) {
    return 0;
  }
  
  const monthlyRate = jenisData.bungaPersen / 100;
  return principal * monthlyRate * months;
}

// Calculate total amount with interest
export function calculateTotalWithInterest(principal: number, jenisId: string, months: number = 1): number {
  const interest = calculateInterest(principal, jenisId, months);
  return principal + interest;
}

// Calculate monthly payment for loans
export function calculateMonthlyPayment(principal: number, jenisId: string, months: number): number {
  const jenisData = getJenisWithPercentage(jenisId);
  if (!jenisData || !jenisData.bungaPersen || months <= 0) {
    return principal / months;
  }
  
  const monthlyRate = jenisData.bungaPersen / 100;
  if (monthlyRate === 0) {
    return principal / months;
  }
  
  // Calculate using compound interest formula
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
  const denominator = Math.pow(1 + monthlyRate, months) - 1;
  
  return numerator / denominator;
}

// Get percentage rate for display
export function getPercentageRate(jenisId: string): number {
  const jenisData = getJenisWithPercentage(jenisId);
  return jenisData?.bungaPersen || 0;
}
