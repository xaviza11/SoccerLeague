const LoginSchema = {
  $id: "LoginSchema",
  tags: ["Login"],
  summary: "Login",
  description: "Login",

  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        description: "User's email",
      },
      password: {
        type: "string",
        description: "User password",
      },
    },
  },

  response: {
    200: {
      description: "User have been created",
      type: "object",
      properties: {
        username: {
          type: "string",
          description: "The username of the user",
          example: "User1",
        },
        token: {
          type: "string",
          description: "The encrypted token",
          example: "23ua8dfyha9d7f7....",
        },
        storage: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
          },
          description: "The uuid of the storage",
          example: "adfdf89...",
        },
        stats: {
          type: "object",
          description: "The stats of the user",
          properties: {
            id: {
              type: "string",
              description: "The uuid of the stats",
              example: "83urj9efy...",
            },
            elo: {
              type: "number",
              description: "The elo of the player for create matches and retrieve the leaderboard",
              example: 100000,
            },
            money: {
              type: "number",
              description: "The current money of the player",
              example: 100000,
            },
            total_games: {
              type: "number",
              description: "The total number of games played by the user",
              example: 4,
            },
            has_game: {
              type: "boolean",
              description: "Value for indicate if the player has a game created.",
              example: false,
            },
          },
        },
      },
    },

    400: {
      description: "Invalid fields",
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          enum: ["Invalid Email", "Invalid Password"],
          example: "Invalid Email",
        },
      },
    },

    401: {
      description: "Invalid Credentials",
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          enum: ["Invalid credentials"],
          example: "Invalid Credentials",
        },
      },
    },

    503: {
      description: "Service unavailable",
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          enum: [
            "Error on retrieve user - 000",
            "Error on retrieve user - 001",
            "Error on retrieve user - 002",
            "Error on retrieve user - 003",
            "Error on retrieve user - 004",
            "Error on retrieve user - 005",
          ],
          example: "Error on retrieve user - 001",
        },
      },
    },
  },
};

export default LoginSchema;
