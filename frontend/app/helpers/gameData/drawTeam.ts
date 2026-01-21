import type { Player } from "@/interfaces";

export interface FormationGroups {
  goalkeeper: Player[];
  defenders: Player[];
  midfielders: Player[];
  forwards: Player[];
}

function sortByLeftRight(players: Player[]): Player[] {
  const left: Player[] = [];
  const right: Player[] = [];
  const middle: Player[] = [];

  players.forEach((player) => {
    if (player.position.includes("Left_")) left.push(player);
    else if (player.position.includes("Right_")) right.push(player);
    else middle.push(player);
  });

  return [...left, ...middle, ...right];
}

export default function dividePlayersByPosition(
  players: Player[],
): FormationGroups {
  const goalkeeper: Player[] = [];
  const defenders: Player[] = [];
  const midfielders: Player[] = [];
  const forwards: Player[] = [];

  players.forEach((player) => {
    const pos = player.position;

    if (["Goalkeeper"].includes(pos)) goalkeeper.push(player);
    else if (["Left_Back", "Right_Back", "Defender"].includes(pos))
      defenders.push(player);
    else if (
      [
        "Defensive_Midfield",
        "Midfielder",
        "Left_Midfield",
        "Right_Midfield",
        "Attacking_Midfield",
      ].includes(pos)
    )
      midfielders.push(player);
    else if (["Left_Wing", "Right_Wing", "Striker"].includes(pos))
      forwards.push(player);
  });

  return {
    goalkeeper,
    defenders: sortByLeftRight(defenders),
    midfielders: sortByLeftRight(midfielders),
    forwards: sortByLeftRight(forwards),
  };
}
