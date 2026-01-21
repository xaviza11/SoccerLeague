<template>
  <div
    :class="$style.miniCard"
    :style="{ background: cardGradient, border: cardBorder }"
    @click="$emit('select', player)"
  >
    <Icon
      name="mdi:account-circle"
      size="36"
      :class="$style.playerIcon"
    />

    <span :class="$style.rating">
      {{ averageWithBonus }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
//@ts-expect-error
import type { Player } from "@/interfaces"
//@ts-expect-error
import { calculatePlayerAverage } from "@/helpers/gameData"

const props = defineProps<{
  player: Player;
  totalCountryBonus: number;
}>();

defineEmits<{
  (e: "select", player: Player): void;
}>();

const gradients = {
  bronze: "var(--bronze-gradient)",
  silver: "var(--silver-gradient)",
  gold: "var(--gold-gradient)",
  diamond: "var(--diamond-gradient)",
};

const average = computed(() =>
  calculatePlayerAverage(
    props.player.skills,
    props.player.position,
  ),
);

const averageWithBonus = computed(() => average.value + props.totalCountryBonus);

const cardGradient = computed(() => {
  const score = averageWithBonus.value;

  if (score >= 90) return gradients.diamond;
  if (score >= 80) return gradients.gold;
  if (score >= 65) return gradients.silver;
  return gradients.bronze;
});

const cardBorder = computed(() => {
  if (averageWithBonus.value >= 90) return "2px solid gold";
  return "2px solid var(--border)";
});
</script>

<style module>
.miniCard {
  width: 64px;
  height: 88px;
  border-radius: 10px;
  padding: 6px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  box-shadow:
    inset 0 1px 0 var(--border-light),
    0 4px 10px rgba(0, 0, 0, 0.4);

  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.miniCard:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 var(--border-light),
    0 6px 14px rgba(0, 0, 0, 0.5);
}

.playerIcon {
  color: white;
  opacity: 0.9;
}

.position {
  font-size: 10px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.rating {
  font-size: 14px;
  font-weight: 700;
  color: white;
}
</style>
