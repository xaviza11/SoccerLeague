<template>
  <div>
    <header :class="style.navbar">
      <div :class="style.iconWrapper">
        <Icon name="mdi:football-pitch" size="32" :class="style.icon" />
        <h1>{{ t("pageName") }}</h1>
      </div>
      <div :class="style.menuWrapper" @click="toggleMenu">
        <Icon name="mdi:menu" size="32" :class="style.icon" />
      </div>
    </header>

    <div :class="style.dropdownMenu" v-if="isOpen">
      <div :class="style.dropdownHeader">
        <h6>{{ parsedName }}</h6>
        <Icon name="mdi:user" size="16" :class="style.blackIcon" />
      </div>
      <div :class="style.dropdownBody">
        <ul :class="style.navList">
          <li>
            <NuxtLink :to="localePath('index')" :class="style.navItem">
              <Icon name="mdi:home" size="18" :class="style.blackIcon" />
              <span>{{ t("home") }}</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink :to="localePath('about')" :class="style.navItem">
              <Icon
                name="mdi:information-outline"
                size="18"
                :class="style.blackIcon"
              />
              <span>{{ t("about") }}</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink :to="localePath('teams')" :class="style.navItem">
              <Icon
                name="mdi:account-group"
                size="18"
                :class="style.blackIcon"
              />
              <span>{{ t("teams") }}</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink :to="localePath('fixtures')" :class="style.navItem">
              <Icon
                name="mdi:calendar-month"
                size="18"
                :class="style.blackIcon"
              />
              <span>{{ t("fixtures") }}</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink :to="localePath('contact')" :class="style.navItem">
              <Icon
                name="mdi:email-outline"
                size="18"
                :class="style.blackIcon"
              />
              <span>{{ t("contact") }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div :class="style.dropdownFooter">
        <button>
          <Icon name="mdi:translate" size="18" :class="style.blackIcon" />
        </button>

        <button>
          <Icon name="mdi:logout" size="18" :class="style.blackIcon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const { t } = useI18n();
const localePath = useLocalePath();

const name = "John_Doe_1231238495349394";
const reducedName = name.slice(0, 12);

const parsedName = name.length > 12 ? reducedName + "..." : name;

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
  console.log(isOpen.value);
};
</script>

<style module="style">
.navbar {
  height: 10vh;
  width: 100vw;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2vh 6vw 2vh 3vw;
}

.icon {
  color: white;
}

.blackIcon {
  color: black;
}

.dropdownMenu {
  height: 40vh;
  width: 20vh;
  position: absolute;
  top: 8vh;
  right: 4vw;
  background-color: var(--surface);
  box-shadow: var(--shadow-md);
  z-index: 100;
}

.dropdownMenu h6 {
  font-size: var(--text-xs);
}

.dropdownMenu li {
  font-size: var(--text-sxs);
  color: black;
}

.dropdownHeader {
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dropdownBody {
  display: flex;
  justify-content: flex-start;
  border-top: 1px solid var(--primary);
  border-bottom: 1px solid var(--primary);
  height: 70%;
}

.dropdownBody ul {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 0.6rem;
  padding: 0.6rem;
}

.dropdownFooter {
  height: 15%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.iconWrapper {
  height: 8vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.navItem {
  display: flex;
  gap: 0.4rem;
}

.navItem span {
  color: var(--text-black);
}

.iconWrapper h1 {
  font-size: var(--text-base);
}

.menuWrapper {
  height: 8vh;
  gap: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
