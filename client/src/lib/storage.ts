import type { FamilyMember } from "@shared/schema";

const STORAGE_KEY = "family-activities-selected-member";

export function getStoredFamilyMember(): FamilyMember | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored as FamilyMember | null;
  } catch {
    return null;
  }
}

export function storeFamilyMember(member: FamilyMember): void {
  try {
    localStorage.setItem(STORAGE_KEY, member);
  } catch {
    // localStorage not available - ignore
  }
}

export function hasStoredFamilyMember(): boolean {
  return getStoredFamilyMember() !== null;
}

export function clearStoredFamilyMember(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage not available - ignore
  }
}