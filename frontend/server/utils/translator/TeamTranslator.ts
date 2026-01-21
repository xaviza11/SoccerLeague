type ErrorRule = {
  match: string;
  key: string;
};

class TeamTranslator {
  private static readonly rules: ErrorRule[] = [
    {
      match: "Invalid token",
      key: "errors.common.unauthorized",
    },
    {
      match: "Error on",
      key: "errors.common.unexpected",
    },
  ];

  static translate(message?: string): string {
    if (!message) {
      return "errors.common.unexpected";
    }

    const rule = this.rules.find((rule) => message.includes(rule.match));

    return rule?.key ?? "errors.common.unexpected";
  }
}

export default TeamTranslator
