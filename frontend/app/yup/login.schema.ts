import * as yup from "yup";

const createLoginSchema = (t: (key: string) => string) =>
  yup.object({
    email: yup
      .string()
      .email(t("warnings.auth.invalidEmail"))
      .required(t("warnings.auth.emailRequired")),

    password: yup
      .string()
      .required(t("warnings.auth.passwordRequired"))
      .min(8, t("warnings.auth.passwordLength"))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t("warnings.auth.passwordFormat")),
  });

export default createLoginSchema;
