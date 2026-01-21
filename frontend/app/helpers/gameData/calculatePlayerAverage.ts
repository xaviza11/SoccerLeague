export default function calculatePlayerAverage(
  skills: Record<string, number>,
  position: string,
) {
  const goalkeeperSkills = [
    "intuition",
    "handling",
    "kicking",
    "reflexes",
  ];

  const isGoalkeeper = position.toLowerCase() === "goalkeeper";

  const relevantSkills = isGoalkeeper
    ? goalkeeperSkills
    : Object.keys(skills).filter(
        (skill) => !goalkeeperSkills.includes(skill),
      );

  const values = relevantSkills.map((skill) => skills[skill] ?? 0);
  const total = values.reduce((sum, val) => sum + val, 0);

  return Math.round((values.length ? total / values.length : 0));
}
