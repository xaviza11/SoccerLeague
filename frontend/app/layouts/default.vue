<template>
  <div>
    <DefaultNavbar />
    <main :class="style.mainContainer">
      <slot />
    </main>
    <DefaultFooter />
  </div>
</template>

<script setup>
import { DefaultNavbar } from "../components/navbars";
import { DefaultFooter } from "../components/footers";
</script>

<style module="style">
.mainContainer {
  padding: 2vh 3vw 2vh 3vw;
  min-height: 90vh;
}
</style>
