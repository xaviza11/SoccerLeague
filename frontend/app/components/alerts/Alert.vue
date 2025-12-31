<template>
  <div v-if="alerts.length" class="alert-overlay">
    <div :class="[$style.alert, $style[alerts[0].type]]">
      <p :class="$style.text">{{ t(alerts[0].message) }}</p>
      <button :class="$style.closeBtn" @click="remove(alerts[0].id)">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlert } from "../../composables/useAlert";
import { useI18n } from "vue-i18n";

const { alerts, removeAlert: remove } = useAlert();
const { t } = useI18n();
</script>

<style module>
.alert-overlay {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background-color: rgb(0, 0, 0);
}

.alert {
  position: absolute;
  top: 30vh;
  bottom: 30vh;
  left: 30vw;
  right: 30vw;
  background-color: var(--surface);
  padding: 2rem 2.5rem;
  border-left: 6px solid transparent;
  border-radius: 8px;
  width: 40vw;
  height: 20vh;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.4), 0 10px 60px rgba(0,0,0,0.3);
  text-align: center;
  font-weight: 500;
  color: var(--text-full-black);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.text {
  color: var(--text-full-black);
}

.success {
  border-left-color: var(--success);
}
.warning {
  border-left-color: var(--warning);
}
.error {
  border-left-color: var(--error);
}
.debug {
  border-left-color: var(--debug);
}
.info {
  border-left-color: var(--info);
}

.closeBtn {
  background: transparent;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: var(--text-full-black);
  transition: color 0.2s ease;
}

.closeBtn:hover {
  transform: scale(1.02);
}

p {
  margin: 0;
}
</style>
