import * as yup from "yup";

const createRegisterSchema = (t: (key: string) => string) =>
  yup.object({
    name: yup.string().required(t("warnings.auth.invalidName")),

    email: yup
      .string()
      .email(t("warnings.auth.invalidEmail"))
      .required(t("warnings.auth.emailRequired")),

    password: yup
      .string()
      .required(t("warnings.auth.passwordRequired"))
      .min(8, t("warnings.auth.passwordLength"))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t("warnings.auth.passwordFormat")),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], t("warnings.auth.passwordsMatch"))
      .required(t("warnings.auth.confirmPassword")),
  });

export default createRegisterSchema;
