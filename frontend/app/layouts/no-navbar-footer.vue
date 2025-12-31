<template>
  <div>
    <main>
      <slot />
      <Alert />
    </main>
  </div>
</template>

<script setup>
import { Alert } from "../components/alerts";
</script>
