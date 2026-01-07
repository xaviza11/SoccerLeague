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
      <div v-if="!isUserLogged" :class="style.dropdownHeader">
        <NuxtLink :to="localePath('login')" :class="style.navItem">
          <Icon name="mdi:login" size="18" :class="style.blackIcon" />
          <span>{{ t("components.navbar.login") }}</span>
        </NuxtLink>
      </div>

      <div>
        <div v-if="isUserLogged" :class="style.dropdownHeader">
          <h6>{{ parsedName }}</h6>
          <Icon name="mdi:user" size="16" :class="style.blackIcon" />
        </div>

        <div :class="style.dropdownBody">
          <ul :class="style.navList">
            <li>
              <NuxtLink :to="localePath('index')" :class="style.navItem">
                <Icon name="mdi:home" size="18" :class="style.blackIcon" />
                <span>{{ t("components.navbar.home") }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('about')" :class="style.navItem">
                <Icon name="mdi:information-outline" size="18" :class="style.blackIcon" />
                <span>{{ t("components.navbar.about") }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('team')" :class="style.navItem">
                <Icon name="mdi:account-group" size="18" :class="style.blackIcon" />
                <span>{{ t("components.navbar.team") }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('fixtures')" :class="style.navItem">
                <Icon name="mdi:calendar-month" size="18" :class="style.blackIcon" />
                <span>{{ t("components.navbar.fixtures") }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('contact')" :class="style.navItem">
                <Icon name="mdi:email-outline" size="18" :class="style.blackIcon" />
                <span>{{ t("components.navbar.contact") }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div :class="style.dropdownFooter">
          <SwitchLocale />
          <button @click="logout">
            <Icon name="mdi:logout" size="18" :class="style.blackIcon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "../../stores";
import { handlerLogout } from "../../handlers/users";
import SwitchLocale from "./SwitchLocale.vue";

const { t } = useI18n();
const localePath = useLocalePath();
const userStore = useUserStore();

const parsedName = computed(() => {
  const name = userStore.name;
  if (!name) return "not-logged";
  return name.length > 12 ? name.slice(0, 12) + "..." : name;
});

const isUserLogged = computed(() => parsedName.value !== "not-logged");

const isOpen = ref(false);
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const logout = async () => {
  try {
    await handlerLogout();
    userStore.reset(); 
    isOpen.value = false;
  } catch (error) {
    console.error("Error:", error);
  }
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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
  overflow-y: auto;
  justify-content: flex-start;
  border-top: 1px solid var(--primary);
  border-bottom: 1px solid var(--primary);
  height: 30vh;
}

.dropdownBody ul {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 0.6rem;
  padding: 0.6rem;
}

.dropdownFooter {
  height: 10%;
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

@media (max-width: 1000px) and (orientation: landscape) {
  .dropdownMenu {
    width: 30vh;
    height: 60vh;
  }

  .dropdownBody {
    height: 42vh;
  }
}
</style>
