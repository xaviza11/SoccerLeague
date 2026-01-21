<template>
  <div :class="style.auraSlot">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
</script>

<style module="style">
.auraSlot {
  background-color: black;
  width: 260px;
  height: 300px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    inset 0 -2px 0 rgba(0, 0, 0, 0.25),
    0 6px 0 rgba(0, 0, 0, 0.35),
    0 12px 24px rgba(0, 0, 0, 0.45);
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    width 0.2s,
    height 0.2s;
}

.auraSlot:hover {
  transform: translateY(-4px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    inset 0 -2px 0 rgba(0, 0, 0, 0.3),
    0 10px 0 rgba(0, 0, 0, 0.4),
    0 18px 32px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .auraSlot {
    width: 64px;
    height: 88px;
  }
}
</style>
