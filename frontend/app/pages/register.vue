<template>
  <div :class="style.main">
    <div :class="style.left">
      <slot name="logo">
        <div :class="style.titleContainer">
          <Icon name="mdi:football-pitch" size="128" style="color: white" />
          <h1>{{ t("pageName") }}</h1>
        </div>
      </slot>
    </div>

    <div :class="style.right">
      <form @submit.prevent="onSubmit" :class="style.formWrapper">
        <div>
          <label>
            <Icon name="mdi:email-outline" size="18" style="color: black" />
            {{ t("pages.register.email") }}
          </label>
          <input type="email" v-model="email" :class="style.formInput" />
          <span :class="style.spanError">{{ errors.email }}</span>
        </div>

        <div>
          <label>
            <Icon name="mdi:account-outline" size="18" style="color: black" />
            {{ t("pages.register.name") }}
          </label>
          <input type="name" v-model="name" :class="style.formInput" />
          <span :class="style.spanError">{{ errors.name }}</span>
        </div>

        <div>
          <label>
            <Icon name="lucide:lock" size="18" style="color: black" />
            {{ t("pages.register.password") }}
          </label>
          <input type="password" v-model="password" :class="style.formInput" />
          <span :class="style.spanError">{{ errors.password }}</span>
        </div>

        <div>
          <label>
            <Icon
              name="mdi:lock-check-outline"
              size="18"
              style="color: black"
            />
            {{ t("pages.register.repeatPassword") }}
          </label>
          <input
            type="password"
            v-model="confirmPassword"
            :class="style.formInput"
          />
          <span :class="style.spanError">{{ errors.confirmPassword }}</span>
        </div>

        <button type="submit" :class="style.button">
          <Icon
            name="mdi:account-plus-outline"
            size="18"
            style="color: white"
          />
          {{ t("pages.register.register") }}
        </button>

        <div :class="style.linksContainer">
          <NuxtLink to="/login" :class="style.linkButton">
            <Icon name="mdi:login" size="16" style="color: var(--primary)" />
            {{ t("pages.register.goLogin") }}
          </NuxtLink>

          <NuxtLink to="/" :class="style.linkButton">
            <Icon name="mdi:home" size="16" style="color: var(--primary)" />
            {{ t("pages.register.goHome") }}
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const invalidEmailErr = t('warnings.auth.invalidEmail')
const emailRequiredErr = t('warnings.auth.emailRequired')
const passwordRequiredErr = t('warnings.auth.passwordRequired')
const passwordLengthErr = t('warnings.auth.passwordLength')
const passwordFormatErr = t('warnings.auth.passwordFormat')
const passwordMatchErr = t('warnings.auth.passwordsMatch')
const confirmPasswordErr = t('warnings.auth.confirmPassword')

const schema = yup.object({
  email: yup.string().email(invalidEmailErr).required(emailRequiredErr),

  password: yup
    .string()
    .required(passwordRequiredErr)
    .min(8, passwordLengthErr)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      passwordFormatErr
    ),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], passwordMatchErr)
    .required(confirmPasswordErr),
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const { value: email } = useField<string>("email");
const { value: password } = useField<string>("password");
const { value: confirmPassword } = useField<string>("confirmPassword");

const onSubmit = handleSubmit((values) => {
  console.log("Register payload:", values);
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
