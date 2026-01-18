// modules/swagger/schemas/gameDataResponse.schema.ts
const GameDataResponseSchema = {
  $id: "GetGameData",
  tags: ["Game Data"],
  summary: "Get game data",
  description: "Retrieve game data for the authenticated user",

  headers: {
    type: "object",
    required: ["authorization"],
    properties: {
      authorization: {
        type: "string",
        description: "Bearer access token ej: Bearer 89fa8h89ad...",
      },
    },
  },

  response: {
    200: {
      description: "Game data retrieved successfully",
      type: "object",
      additionalProperties: true,

      properties: {
        position_change_cards: {
          type: "array",
          description: "Cards that allow changing a player's position",
          items: {
            type: "object",
            additionalProperties: true,
          },
        },

        cards: {
          type: "array",
          description: "Player cards owned by the user",
          items: {
            type: "object",
            additionalProperties: true,
          },
        },

        team: {
          type: "object",
          description: "Current team configuration of the user",
          additionalProperties: true,

          properties: {
            id: {
              type: "string",
              description: "Unique identifier of the team",
              example: "76840e9e-e60e-438a-9387-ea1e4b62a35e",
            },
            name: {
              type: "string",
              description: "Team name",
              example: "YourTeam",
            },
            players: {
              type: "array",
              description: "Players currently in the team",
              items: {
                type: "object",
                additionalProperties: true,
              },
            },
            storage: {
              type: "object",
              description: "Team storage information",
              additionalProperties: true,
              properties: {
                id: {
                  type: "string",
                  description: "Storage identifier",
                  example: "4eca7963-c76c-4f1f-9287-85ffb6216c43",
                },
              },
            },
            bench_players: {
              type: "array",
              description: "Players on the bench",
              items: {
                type: "object",
                additionalProperties: true,
              },
            },
            auras: {
              type: "array",
              description: "Active team auras or buffs",
              items: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
      },
    },

    401: {
      description: "Unauthorized - Missing or invalid token",
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          enum: ["Invalid authorization header", "Invalid token"],
          example: "Invalid authorization header",
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
          enum: ["Error on retrieve game data - 001"],
        },
      },
    },
  },
};

export default GameDataResponseSchema;
