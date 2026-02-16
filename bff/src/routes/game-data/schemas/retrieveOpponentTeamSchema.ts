const RetrieveOpponentTeamSchema = {
  $id: "RetrieveOpponentTeam",
  tags: ["Game Data"],
  summary: "Get Opponent Team",
  description: "Retrieves the full team details of an opponent using their user ID. Requires a valid encrypted token.",

  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
        description: "The User UUID of the opponent",
      },
    },
  },

  headers: {
    type: "object",
    required: ["authorization"],
    properties: {
      authorization: {
        type: "string",
        description: "Bearer token (encrypted)",
      },
    },
  },

  response: {
    200: {
      description: "Opponent team retrieved successfully",
      type: "object",
      properties: {
        id: { type: "string", description: "Team ID" },
        name: { type: "string", description: "Team Name" },
        lineup: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              position: { type: "string" },
              overall: { type: "number" },
            },
          },
        },
        tactics: { type: "string" },
      },
    },

    401: {
      description: "Authentication Error",
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          enum: ["Invalid authorization header", "Empty authorization token", "Invalid token"],
          example: "Invalid token",
        },
      },
    },

    503: {
      description: "Service Error",
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          enum: ["Unexpected Error"],
          example: "Unexpected Error",
        },
      },
    },
  },
};

export default RetrieveOpponentTeamSchema;