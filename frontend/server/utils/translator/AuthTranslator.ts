type ErrorRule = {
  match: string;
  key: string;
};

export class AuthErrorTranslator {
  private static readonly rules: ErrorRule[] = [
    {
      match: "Name must have almost one character",
      key: "errors.auth.nameInvalidLength",
    },
    {
      match: "Invalid email format",
      key: "errors.auth.invalidEmailFormat",
    },
    {
      match: "The password must be",
      key: "errors.auth.weakPassword",
    },
    {
      match: "Email is already in use",
      key: "errors.auth.emailAlreadyUsed",
    },
    {
      match: "Name is already in use",
      key: "errors.auth.nameAlreadyUsed",
    },
    {
      match: "Invalid credentials",
      key: "errors.auth.invalidCredentials",
    },
    {
      match: "Error creating user",
      key: "errors.auth.errorCreatingUser",
    },
  ];

  static translate(message?: string): string {
    if (!message) {
      return "errors.auth.errorCreatingUser";
    }

    const rule = this.rules.find((rule) => message.includes(rule.match));

    return rule?.key ?? "errors.auth.errorCreatingUser";
  }
}
