<template>
  <div
    :class="$style.playerCard"
    :style="{ background: cardGradient, border: cardBorder }"
  >
    <div v-if="!showSkills" :class="$style.playerIconContainer">
      <Icon name="mdi:account-circle" size="96" :class="$style.playerIcon" />
    </div>

    <div v-if="showSkills">
      <ul>
        <li v-for="(value, skill) in player.skills" :key="skill">
          <p v-if="value > 0" :class="$style.text">{{ skill }}: {{ value }}</p>
        </li>
      </ul>

      <div :class="$style.iconActions">
        <Icon
          name="mdi:arrow-left"
          size="28"
          :class="$style.actionIcon"
          @click="toggleView"
        />
      </div>
    </div>

    <!-- INFO -->
    <div v-else>
      <div :class="$style.nameWrapper">
        <h4>{{ player.name }}</h4>
      </div>

      <div :class="$style.playerDetail">
        <p :class="$style.text">
          <Icon name="mdi:soccer" size="16" /> {{ player.position }}
        </p>

        <p :class="$style.text">
          <Icon name="mdi:flag" size="16" /> {{ player.country }}
        </p>

        <p :class="$style.text">{{ t('components.cards.age') }} {{ player.status.age }}</p>
        <p :class="$style.text">{{ t('components.cards.average') }} {{ averageWithBonus.toFixed(2) }}</p>
      </div>

      <div :class="$style.iconActions">
        <Icon
          name="mdi:cog"
          size="28"
          :class="$style.actionIcon"
          @click="openInstructions"
        />

        <Icon
          name="mdi:tag-outline"
          size="28"
          :class="[$style.actionIcon, $style.sellIcon]"
        />

        <Icon
          name="mdi:chart-bar"
          size="28"
          :class="$style.actionIcon"
          @click="toggleView"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
//@ts-expect-error
import { calculatePlayerAverage } from "@/helpers/gameData";
//@ts-expect-error
import type { Player } from "@/interfaces";

import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  player: Player;
  totalCountryBonus: number;
}>();

const defaultImage = "/default-player.png";
const showSkills = ref(false);

const gradients = {
  bronze: "var(--bronze-gradient)",
  silver: "var(--silver-gradient)",
  gold: "var(--gold-gradient)",
  diamond: "var(--diamond-gradient)",
};

const cardBorder = computed(() => {
  const score = averageWithBonus.value;

  if (score >= 90) return "4px solid gold";
  return "4px solid black";
});

const average = computed(() =>
  calculatePlayerAverage(
    props.player.skills,
    props.player.position,
  ),
);

const averageWithBonus = computed(
  () => average.value + props.totalCountryBonus,
);

const cardGradient = computed(() => {
  const score = averageWithBonus.value;

  if (score >= 90) return gradients.diamond;
  if (score >= 80) return gradients.gold;
  if (score >= 65) return gradients.silver;
  return gradients.bronze;
});

const toggleView = () => (showSkills.value = !showSkills.value);
const openInstructions = () => alert("Todo");
</script>

<style module>
.playerCard {
  width: 260px;
  height: 300px;
  border-radius: 12px;
  padding: 16px;
  color: var(--primary-content);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  box-shadow:
    inset 0 1px 0 var(--border),
    inset 0 -2px 0 rgba(0, 0, 0, 0.25),
    0 6px 0 rgba(0, 0, 0, 0.35),
    0 12px 24px rgba(0, 0, 0, 0.45);

  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.playerCard:hover {
  transform: translateY(-4px);
  box-shadow:
    inset 0 1px 0 var(--border-light),
    inset 0 -2px 0 rgba(0, 0, 0, 0.3),
    0 10px 0 rgba(0, 0, 0, 0.4),
    0 18px 32px rgba(0, 0, 0, 0.5);
}

.nameWrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nameWrapper h4 {
  font-size: 1.25rem;
}

.playerDetail {
  width: 100%;
  padding: 1rem 1rem;
}

.playerIconContainer {
  display: flex;
  justify-content: center;
  color: white;
}

.playerIcon {
  color: white;
}

.iconActions {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.actionIcon {
  cursor: pointer;
  color: white;
  transition:
    transform 0.15s ease,
    color 0.15s ease;
}

.actionIcon:hover {
  transform: translateY(-2px) scale(1.1);
}

.text {
  color: white;
}
</style>
