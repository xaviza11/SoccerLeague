<template>
  <div :class="style.langSelector">
    <button @click="toggleMenu" :class="style.langButton">
      {{ currentLanguage.label }}
    </button>

    <ul v-if="isOpen" :class="style.langList">
      <li v-for="lang in languages" :key="lang.code">
        <button @click="selectLanguage(lang)">
          {{ lang.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { locale, setLocale, switchLocalePath } = useI18n();

const isOpen = ref(false);

const languages = [
  { code: "es", label: "Español" },
  { code: "ca", label: "Català" },
  { code: "en", label: "English" },
];

const currentLanguage = computed(() => {
  return languages.find((l) => l.code === locale.value) || languages[0];
});

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const selectLanguage = (lang) => {
  setLocale(lang.code);
  const path = switchLocalePath(lang.code);
  if (path) window.location.href = path;
};
</script>

<style module="style">
.langSelector {
  position: relative;
  display: inline-block;
}

.langButton {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  background-color: var(--primary-light);
  color: var(--text-black);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.langList {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--surface);
  box-shadow: var(--shadow-md);
  border-radius: 4px;
  margin-top: 0.2rem;
  padding: 0.4rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  z-index: 100;
}

.langList li button {
  background: none;
  border: none;
  text-align: left;
  padding: 0.3rem 0.6rem;
  width: 100%;
  cursor: pointer;
}

.langList li button:hover {
  background-color: var(--primary-light);
}
</style>
