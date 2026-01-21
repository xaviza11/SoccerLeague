<template>
  <div :class="style.benchContainer" @dragover="onDragOver" @drop="onDrop">
    <ResponsivePlayerCard
      v-for="player in benchPlayers"
      :key="player.id"
      :player="player"
      :totalCountryBonus="totalCountryBonus"
    />
  </div> 
</template>

<script setup lang="ts">
//@ts-expect-error
import ResponsivePlayerCard from "./ResponsivePlayerCard.vue";
//@ts-expect-error
import { useGameDataStore } from "@/stores";
import { computed } from "vue";

const props = defineProps<{
  totalCountryBonus: number;
}>();

const gameDataStore = useGameDataStore();

const benchPlayers = computed(() => gameDataStore.benchPlayers);

function onDragOver(event: DragEvent) {
  event.preventDefault();
} 

function onDrop(event: DragEvent) {
  event.preventDefault();
  if (!event.dataTransfer) return;

  const playerId = event.dataTransfer.getData("application/player-id");
  if (!playerId) return;

  const player = gameDataStore.benchPlayers.find(p => p.id === playerId);
  if (!player) return;

  console.log('Moviendo al campo principal');

  gameDataStore.movePlayerToMain(player);
}
</script>


<style module="style">
.benchContainer {
  width: 60vw;
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 14px;
  border-radius: 12px;
  scroll-behavior: smooth;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--tertiary);
}
</style>
