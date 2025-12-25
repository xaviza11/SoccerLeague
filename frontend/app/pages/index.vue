<template>
  <div>
    <h1 :class="$style.ej">{{ t("hello") }}</h1>

    <nav>
      <button @click="setLocale('en')">English</button>
      <button @click="setLocale('es')">Español</button>
    </nav>

    <NuxtLink :to="localePath('about')">Ir a About</NuxtLink>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
const { t, setLocale } = useI18n();
// @ts-ignore 
const localePath = useLocalePath();
</script>

<style module>
.ej {
  color: red;
}
</style>
