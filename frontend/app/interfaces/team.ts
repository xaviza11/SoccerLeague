import type Player from "./player"

export default interface Team {
  id: string;
  name: string;
  players: Player[];
  storage: { id: string };
  auras: [];
}
