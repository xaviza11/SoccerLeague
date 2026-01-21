<template>
  <div :class="style.main">
    <div :class="style.left">
      <slot name="logo">
        <div :class="style.titleContainer">
          <Icon name="mdi:football-pitch" size="128" :class="style.whiteIcon" />
          <h1>{{ t("pageName") }}</h1>
        </div>
      </slot>
    </div>

    <div :class="style.right">
      <form @submit.prevent="onSubmit" :class="style.formWrapper">
        <div>
          <label>
            <Icon name="mdi:email-outline" size="18" :class="style.blackIcon" />
            {{ t("pages.register.email") }}
          </label>
          <input type="email" v-model="email" :class="style.formInput" />
          <span :class="style.spanError">{{ errors.email }}</span>
        </div>

        <div>
          <label>
            <Icon name="mdi:account-outline" size="18" :class="style.blackIcon" />
            {{ t("pages.register.name") }}
          </label>
          <input type="name" v-model="name" :class="style.formInput" />
          <span :class="style.spanError">{{ errors.name }}</span>
        </div>

        <div>
          <label>
            <Icon name="lucide:lock" size="18" :class="style.blackIcon" />
            {{ t("pages.register.password") }}
          </label>
          <input type="password" v-model="password" :class="style.formInput" />
          <span :class="style.spanError">{{ errors.password }}</span>
        </div>

        <div>
          <label>
            <Icon name="mdi:lock-check-outline" size="18" style="color: black" />
            {{ t("pages.register.repeatPassword") }}
          </label>
          <input type="password" v-model="confirmPassword" :class="style.formInput" />
          <span :class="style.spanError">{{ errors.confirmPassword }}</span>
        </div>

        <button type="submit" :class="style.button">
          <Icon name="mdi:account-plus-outline" size="18" :class="style.whiteIcon" />
          {{ t("pages.register.register") }}
        </button>

        <div :class="style.linksContainer">
          <NuxtLink :to="localePath('login')" :class="style.linkButton">
            <Icon name="mdi:login" size="16" :class="style.blackIcon" />
            {{ t("pages.register.goLogin") }}
          </NuxtLink>

          <NuxtLink :to="localePath('index')" :class="style.linkButton">
            <Icon name="mdi:home" size="16" :class="style.blackIcon" />
            {{ t("pages.register.goHome") }}
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { useI18n } from "vue-i18n";
//@ts-expect-error
import { createRegisterSchema } from "@/yup";
//@ts-expect-error
import { useRegister } from "#imports";

//@ts-expect-error
definePageMeta({
  layout: "no-navbar-footer",
});

const { t } = useI18n();
//@ts-expect-error
const localePath = useLocalePath();

const { register } = useRegister();

const schema = createRegisterSchema(t);

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const { value: name } = useField<string>("name");
const { value: email } = useField<string>("email");
const { value: password } = useField<string>("password");
const { value: confirmPassword } = useField<string>("confirmPassword");

const onSubmit = handleSubmit(async ({ name, email, password }) => {
  const success = await register(name, email, password, t);

  if (success) {
    //@ts-expect-error
    await navigateTo(localePath("/"));
  }
});
</script>

<style module="style">
.main {
  width: 100vw;
  height: 100vh;
  display: flex;
}

.titleContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2vh;
}

.formWrapper {
  display: flex;
  width: 25vw;
  max-width: 25vw;
  flex-direction: column;
  justify-content: center;
  gap: 2vh;
}

.formInput {
  width: 100%;
  border-bottom: 1px solid black;
}

.spanError {
  color: var(--error);
  font-size: var(--text-sxs);
}

.left {
  width: 50vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary);
}

.right {
  width: 50vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--accent);
}

.linksContainer {
  display: flex;
  max-width: 25vw;
  justify-content: space-between;
}

.linkButton:hover {
  border-bottom: 1px solid black;
}

.button {
  background-color: var(--secondary);
  padding: 1vh;
  color: white;
}

.button:hover {
  background-color: var(--secondary-hover);
}

.blackIcon {
  color: black;
}

.whiteIcon {
  color: white;
}

@media screen and (orientation: portrait) {
  .main {
    flex-direction: column;
  }

  .right {
    width: 100vw;
  }

  .left {
    height: 66vh;
    width: 100vw;
  }

  .formWrapper {
    max-width: 55vw;
  }

  .linksContainer {
    max-width: 55vw;
  }
}

@media screen and (max-width: 768px) and (orientation: landscape) {
  .linkButton {
    font-size: var(--text-sxs);
  }
}
</style>
