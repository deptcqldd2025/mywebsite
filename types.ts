
export interface SafetyCheck {
  compliant: boolean;
  reason: string;
}

export interface AnalysisResult {
  whiteHelmet: SafetyCheck;
  helmetStrapFastened: SafetyCheck;
  orangeSuit: SafetyCheck;
  sleeveButtonsFastened: SafetyCheck;
  safetyShoes: SafetyCheck;
}
