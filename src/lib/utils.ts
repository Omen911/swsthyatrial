import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateCalories(age: number, gender: string, weight: number, height: number, activityLevel: string) {
  // Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  return Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));
}

export const getDoshaDiet = (dosha: string) => {
  switch (dosha) {
    case 'Vata':
      return "Warm, moist, grounding foods. Favor sweet, sour, and salty tastes.";
    case 'Pitta':
      return "Cooling, substantial foods. Favor sweet, bitter, and astringent tastes.";
    case 'Kapha':
      return "Warm, light, dry foods. Favor pungent, bitter, and astringent tastes.";
    default:
      return "Balanced diet based on seasonal availability.";
  }
};
