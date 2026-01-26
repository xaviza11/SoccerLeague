const UpdateTeamLineupSchema = {
  $id: "UpdateTeamLineup",
  tags: ["Team"],
  summary: "Update team lineup (bench players)",
  description:
    "Updates the bench status of players in the authenticated user's team",

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

  body: {
    type: "object",
    required: ["players"],
    properties: {
      players: {
        type: "array",
        description: "List of players with updated bench status",
        items: {
          type: "object",
          required: ["id", "isBench"],
          properties: {
            id: {
              type: "string",
              description: "Player unique identifier",
            },
            isBench: {
              type: "boolean",
              description: "Indicates whether the player is on the bench",
            },
          },
          additionalProperties: true,
        },
      },
    },
    additionalProperties: true,
  },

  response: {
    200: {
      description: "Team lineup updated successfully",
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          example: "success",
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
          example: "Invalid token",
        },
      },
    },

    403: {
      description: "Forbidden - Player does not belong to the team",
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          example: "Error updating player",
        },
      },
    },

    422: {
      description: "Unprocessable Entity - Business rule validation error",
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          example: [
            "Players payload is missing or invalid",
            "User has no team",
            "Team players are invalid",
            "Payload player id is missing",
            "Player does not exist",
          ],
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
          example: "Service unavailable",
        },
      },
    },
  },
};

export default UpdateTeamLineupSchema;
