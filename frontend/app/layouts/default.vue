<template>
  <div>
    <DefaultNavbar />
    <main :class="style.mainContainer">
      <slot />
      <Alert />
    </main>
    <DefaultFooter />
  </div>
</template>

<script setup>
import { DefaultNavbar } from "@/components/navbars";
import { DefaultFooter } from "@/components/footers";
import { Alert } from "@/components/alerts";
</script>

<style module="style">
.mainContainer {
  padding: 2vh 3vw 2vh 3vw;
  min-height: 90vh;
}
</style>
