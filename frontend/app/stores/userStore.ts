import { defineStore } from "pinia";

const useUserStore = defineStore(
  "user",
  () => {
    const name = ref<string | null>(null);
    const storage = ref<string | null>(null);
    const elo = ref<number | null>(null);
    const money = ref<number | null>(null);
    const totalGames = ref<number | null>(null);

    function setName(newName: string) {
      name.value = newName;
    }

    function setStorage(newStorage: string){
      storage.value = newStorage;
    }

    function setElo(newElo: number) {
      elo.value = newElo;
    }

    function setMoney(newMoney: number) {
      money.value = newMoney;
    }

    function setTotalGames(newTotalGames: number) {
      totalGames.value = newTotalGames;
    }

    function reset() {
      name.value = null;
      storage.value = null;
      elo.value = null;
      money.value = null;
      totalGames.value = null;
    }

    return { name, storage, elo, money, totalGames, setName, setStorage, setElo, setMoney, setTotalGames, reset };
  },
  {
    persist: true,
  },
);

export default useUserStore;
