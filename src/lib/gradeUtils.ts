/**
 * Utility functions for handling climbing grades and ranges.
 */

// Basic mapping of Font grades to a numerical value for sorting
const FONT_VALUES: Record<string, number> = {
  '4': 40,
  '5': 50,
  '6A': 60,
  '6A+': 61,
  '6B': 62,
  '6B+': 63,
  '6C': 64,
  '6C+': 65,
  '7A': 70,
  '7A+': 71,
  '7B': 72,
  '7B+': 73,
  '7C': 74,
  '7C+': 75,
  '8A': 80,
  '8A+': 81,
  '8B': 82,
  '8B+': 83,
  '8C': 84,
  '8C+': 85,
  '9A': 90,
};

/**
 * Extracts the base grade number from a V-grade string (e.g., "V3" -> 3)
 */
export const parseVGrade = (grade: string): number => {
  const match = grade.match(/V(\d+)/i);
  return match ? parseInt(match[1], 10) : -1;
};

/**
 * Parases a range and takes the minimum value for sorting
 * e.g. "V3-V5" -> 3
 * e.g. "6A-6B" -> 60
 */
export const getSortValue = (gradeStr: string, system: 'v' | 'font'): number => {
  if (!gradeStr) return -1;
  
  // Split by range symbols if present
  const parts = gradeStr.split(/[-/]/);
  const baseGrade = parts[0].trim();

  if (system === 'v') {
    return parseVGrade(baseGrade);
  } else {
    // Exact match or closest match
    return FONT_VALUES[baseGrade] ?? (parseInt(baseGrade, 10) * 10 || -1);
  }
};
