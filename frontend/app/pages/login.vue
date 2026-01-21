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
            {{ t("pages.login.email") }}
          </label>
          <input type="email" v-model="email" :class="style.formInput" />
          <span :class="style.spanError">{{ errors.email }}</span>
        </div>

        <div>
          <label>
            <Icon name="lucide:lock" size="18" :class="style.blackIcon" />
            {{ t("pages.login.password") }}
          </label>
          <input type="password" v-model="password" :class="style.formInput" />
          <span :class="style.spanError">{{ errors.password }}</span>
        </div>

        <button type="submit" :class="style.button">
          <Icon name="mdi:login" size="18" :class="style.whiteIcon" />
          {{ t("pages.login.login") }}
        </button>

        <div :class="style.linksContainer">
          <NuxtLink :to="localePath('register')" :class="style.linkButton">
            <Icon name="mdi:account-plus" size="16" :class="style.blackIcon" />
            {{ t("pages.login.goRegister") }}
          </NuxtLink>

          <NuxtLink :to="localePath('index')" :class="style.linkButton">
            <Icon name="mdi:home" size="16" :class="style.blackIcon" />
            {{ t("pages.login.goHome") }}
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm, useField } from "vee-validate";
//@ts-expect-error
import { createLoginSchema } from "@/yup";
//@ts-expect-error
import { useLogin } from "#imports";
import { useI18n } from "vue-i18n";

//@ts-expect-error
definePageMeta({
  layout: "no-navbar-footer",
});

const { t } = useI18n();
//@ts-expect-error
const localePath = useLocalePath();

const { login } = useLogin();

const schema = createLoginSchema(t);

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const { value: email } = useField<string>("email");
const { value: password } = useField<string>("password");

const onSubmit = handleSubmit(async ({ email, password }) => {
  const success = await login(email, password, t);

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
