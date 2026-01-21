<template>
  <div :class="style.auraSlotsRow">
    <AuraSlot />
    <AuraSlot />
  </div>
</template>

<script setup lang="ts">
//@ts-ignore-error
import AuraSlot from "./AuraSlot.vue";
</script>

<style module="style">
.auraSlotsRow {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  width: 60vw;
  overflow-x: auto;
  padding: 14px;
  scroll-behavior: smooth;
  background-color: var(--tertiary);
  border-radius: 12px;
}
</style>
