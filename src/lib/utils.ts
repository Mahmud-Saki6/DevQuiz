export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function difficultyStepHarder(d: "easy" | "medium" | "hard") {
  if (d === "easy") return "medium";
  if (d === "medium") return "hard";
  return "hard";
}

