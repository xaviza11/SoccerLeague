const CreateUserSchema = {
  $id: "CreateUser",
  tags: ["Create User"],
  summary: "Create User",
  description: "Create one user",

  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: {
        type: "string",
        description: "User's full name",
      },
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
    201: {
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
          enum: ["Name must have almost one character", "Invalid Email", "Invalid Password"],
          example: "Invalid Email",
        },
      },
    },

    409: {
      description: "Already exist",
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          enum: ["Email is already in use - CRUD", "Name is already in use - CRUD"],
          example: "Email is already in use - CRUD",
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
            "Error creating user - 000",
            "Error creating user - 001",
            "Error creating user - 003",
            "Error creating user - 004",
            "Error creating user - 005",
            "Error creating user - 006",
            "Error creating user - 007",
            "Error creating user - 008",
            "Error creating user - 009",
            "Error creating user - 010",
            "Error creating user - 011",
          ],
        },
      },
    },
  },
};

export default CreateUserSchema;
