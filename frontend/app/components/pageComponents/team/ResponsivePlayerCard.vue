<template>
  <div
    :class="$style.cardWrapper"
    draggable="true"
    @dragstart="onDragStart"
  >
    <!-- Desktop -->
    <PlayerCard
      :class="$style.desktopCard"
      :player="player"
      :totalCountryBonus="totalCountryBonus"
    />

    <!-- Mobile -->
    <MiniPlayerCard
      :class="$style.mobileCard"
      :player="player"
      :totalCountryBonus="totalCountryBonus"
    />
  </div>
</template>

<script setup lang="ts">
//@ts-expect-error
import { PlayerCard, MiniPlayerCard } from "@/components/cards";
//@ts-expect-error
import type { Player } from "@/interfaces";

const props = defineProps<{
  player: Player;
  totalCountryBonus: number;
}>();

function onDragStart(event: DragEvent) {
  if (!event.dataTransfer) return;

  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData(
    "application/player-id",
    props.player.id.toString()
  );
}
</script>

<style module>
.cardWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
}

.cardWrapper:active {
  cursor: grabbing;
}

.desktopCard {
  display: none;
}

.mobileCard {
  display: block;
}

@media (min-width: 1024px) {
  .desktopCard {
    display: block;
  }

  .mobileCard {
    display: none;
  }
}
</style>
