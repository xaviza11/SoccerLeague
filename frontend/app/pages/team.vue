<template>
  <div v-if="gameDataStore.team" :class="$style.teamContainer">
    
    <div :class="$style.teamInfo">
      <p :class="$style.teamName">{{ t('pages.team.name') }}{{ gameDataStore.team.name }}</p>
      <p :class="$style.teamChemistry">{{ t('pages.team.chemistry') }} {{ totalCountryBonus }}</p>
    </div>

    <MainTeam
      :players="gameDataStore.team.players || []"
      :totalCountryBonus="totalCountryBonus"
    />

    <div :class="$style.benchAuraContainer || []">
      <BenchTeam
        :players="gameDataStore.team.players"
        :totalCountryBonus="totalCountryBonus"
      />

      <AuraSlotRow />
    </div>
  </div>

  <div v-else>
    <p>{{ t('pages.team.loading') }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
//@ts-expect-error
import useRetrieveGameData from "@/composables/useRetrieveGameData";
//@ts-expect-error
import { useGameDataStore } from "@/stores";
//@ts-expect-error
import { getTotalCountryBonus } from "@/helpers/gameData";
//@ts-expect-error
import {MainTeam, BenchTeam, AuraSlotRow} from "@/components/pageComponents/team";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { retrieveGameData } = useRetrieveGameData();
const gameDataStore = useGameDataStore();

const totalCountryBonus = computed(() => {
  if (!gameDataStore.team.players) return 0;
  return getTotalCountryBonus(gameDataStore.team.players);
});

onMounted(async () => {
  await retrieveGameData((key: string) => key);
});
</script>

<style module>
.teamContainer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.teamInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--secondary);
  padding: 12px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

.teamName {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.teamChemistry {
  font-size: 1.2rem;
  color: white;
  font-weight: 500;
}

.benchAuraContainer {
  gap: 1rem;
  display: flex;
  align-items: center;
  overflow-x: auto;
  width: 100%;
}

.benchAuraContainer::-webkit-scrollbar {
  height: 6px;
}

.benchAuraContainer::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.benchAuraContainer::-webkit-scrollbar-track {
  background: transparent;
}
</style>
