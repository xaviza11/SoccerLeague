import { defineStore } from "pinia";
import { ref } from "vue";
import type { Player, Team } from "@/interfaces";

const useGameDataStore = defineStore("gameData", () => {
  const position_change_cards = ref<any[]>([]);
  const cards = ref<any[]>([]);
  const team = ref<Team | null>(null);
  const players = ref<Player[]>([]);
  const benchPlayers = ref<Player[]>([]);

  const setGameData = (data: any) => {
    position_change_cards.value = data.position_change_cards;
    cards.value = data.cards;
    team.value = data.team;

    if(team.value === null) return

    players.value = team.value.players.filter((p: Player) => !p.isBench);
    benchPlayers.value = team.value.players.filter((p: Player) => p.isBench);
  };

  const resetGameData = () => {
    position_change_cards.value = [];
    cards.value = [];
    team.value = null;
  };

  function movePlayerToBench(player: Player) {
    players.value = players.value.filter((p) => p.id !== player.id);
    benchPlayers.value.push(player);
  }

  function movePlayerToMain(player: Player) {
    benchPlayers.value = benchPlayers.value.filter((p) => p.id !== player.id);
    players.value.push(player);
  }

  return {
    position_change_cards,
    cards,
    team,
    players,
    benchPlayers,
    setGameData,
    resetGameData,
    movePlayerToBench,
    movePlayerToMain,
  };
});

export default useGameDataStore;
