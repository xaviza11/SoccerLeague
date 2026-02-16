const BuyPlayerSchema = {
  $id: "BuyPlayer",
  tags: ["Marketplace"],
  summary: "Buy a new player",
  description: "Generates a new player via Simulator and updates the team storage.",
  
  headers: {
    type: "object",
    required: ["authorization"],
    properties: {
      authorization: {
        type: "string",
        description: "Bearer token for authentication",
      }
    }
  },

  body: {
    type: "object",
    required: ["position", "target_avr", "teamId"],
    properties: {
      position: {
        type: "string",
        description: "Position of the player to generate",
      },
      target_avr: {
        type: "number",
        description: "Target average stats for the player",
      },
      teamId: {
        type: "string",
        description: "The UUID of the team making the purchase",
      }
    }
  },

  response: {
    200: {
      description: "Player bought and team updated successfully",
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        players: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              position: { type: "string" },
              avr: { type: "number" }
            }
          }
        },
        budget: { type: "number" }
      }
    },

    400: {
      description: "Bad Request - Validation or logic error",
      type: "object",
      properties: {
        message: { 
          type: "string",
          enum: ["Error creating player", "Error updating team"],
          example: "Error creating player" 
        }
      }
    },

    401: {
      description: "Unauthorized - Auth errors",
      type: "object",
      properties: {
        message: { 
          type: "string",
          enum: ["Invalid authorization header", "Empty authorization token"],
          example: "Invalid authorization header"
        }
      }
    },

    503: {
      description: "Service Unavailable - External client error",
      type: "object",
      properties: {
        message: { 
          type: "string",
          example: "Unexpected Error" 
        }
      }
    }
  }
};

export default BuyPlayerSchema;