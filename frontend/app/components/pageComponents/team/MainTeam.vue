<script setup lang="ts">
//@ts-expect-error
import ResponsivePlayerCard from "./ResponsivePlayerCard.vue";
//@ts-expect-error
import { dividePlayersByPosition } from "@/helpers/gameData";
//@ts-expect-error
import { useGameDataStore } from "@/stores";
import { computed } from "vue";

const props = defineProps<{
  totalCountryBonus: number;
}>();

const gameDataStore = useGameDataStore();

const mainPlayers = computed(() => gameDataStore.players);

const groups = computed(() => dividePlayersByPosition(mainPlayers.value));

function onDragOver(event: DragEvent) {
  event.preventDefault();
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  if (!event.dataTransfer) return;

  const playerId = event.dataTransfer.getData("application/player-id");
  if (!playerId) return;

  const player = mainPlayers.value.find(p => p.id === playerId);
  if (!player) return;

  gameDataStore.movePlayerToBench(player);
}
</script>

<template>
  <div :class="style.teamFormation" @dragover="onDragOver" @drop="onDrop">
    <!-- Goalkeeper -->
    <div :class="style.goalkeeperRow">
      <ResponsivePlayerCard
        v-for="player in groups.goalkeeper"
        :key="player.id"
        :player="player"
        :totalCountryBonus="totalCountryBonus"
      />
    </div>

    <!-- Defenders -->
    <div :class="style.defendersRow">
      <ResponsivePlayerCard
        v-for="player in groups.defenders"
        :key="player.id"
        :player="player"
        :totalCountryBonus="totalCountryBonus"
      />
    </div>

    <!-- Midfielders -->
    <div :class="style.midfieldersRow">
      <ResponsivePlayerCard
        v-for="player in groups.midfielders"
        :key="player.id"
        :player="player"
        :totalCountryBonus="totalCountryBonus"
      />
    </div>

    <!-- Forwards -->
    <div :class="style.forwardsRow">
      <ResponsivePlayerCard
        v-for="player in groups.forwards"
        :key="player.id"
        :player="player"
        :totalCountryBonus="totalCountryBonus"
      />
    </div>
  </div>
</template>

<style module="style">
.teamFormation {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  background-image: url("../../../assets/textures/grass.jpg");
  padding: 2rem;
  border-radius: 12px;
}

.goalkeeperRow,
.defendersRow,
.midfieldersRow,
.forwardsRow {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
