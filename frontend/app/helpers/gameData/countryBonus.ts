function calculateCountryBonus(count: number) {
  if (count <= 1) return 0;
  if (count === 2) return 1;
  if (count === 3) return 2;
  if (count === 4) return 3;
  return 4;
}

export default function getTotalCountryBonus(players: { country: string }[]) {
  const counts: Record<string, number> = {};

  players.forEach(player => {
    counts[player.country] = (counts[player.country] || 0) + 1;
  });

  return Object.values(counts).reduce((total, count) => total + calculateCountryBonus(count), 0);
}