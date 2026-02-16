const RetrieveUserGameSchema = {
  $id: "RetrieveUserGame",
  tags: ["Game Data"],
  summary: "Retrieve Current User Game",
  description: "Validates the user's encrypted token and retrieves their active game session from the games service.",

  headers: {
    type: "object",
    required: ["authorization"],
    properties: {
      authorization: {
        type: "string",
        description: "Bearer token (encrypted)",
      }
    }
  },

  response: {
    200: {
      description: "User game data retrieved successfully",
      type: "object",
      properties: {
        id: { 
          type: "string", 
          format: "uuid",
          description: "The unique ID of the game" 
        },
        status: { 
          type: "string", 
          enum: ["active", "finished", "waiting"],
          description: "Current state of the game session"
        },
        home_team: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            score: { type: "number" }
          }
        },
        away_team: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            score: { type: "number" }
          }
        },
        created_at: { type: "string", format: "date-time" }
      }
    },

    401: {
      description: "Authentication Error",
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          enum: [
            "Invalid authorization header", 
            "Empty authorization token", 
            "Invalid token"
          ],
          example: "Invalid token"
        }
      }
    },

    500: {
      description: "Internal Server Error",
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          example: "Internal server error"
        }
      }
    }
  }
};

export default RetrieveUserGameSchema;