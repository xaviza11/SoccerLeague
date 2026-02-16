const GetUserRankingSchema = {
  $id: "GetUserRanking",
  tags: ["Ranking"],
  summary: "Get specific user rank",
  description:
    "Retrieve the ranking position and stats for a specific user by UUID.",

  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "The unique identifier (UUID) of the user",
      },
    },
  },

  response: {
    200: {
      description: "User ranking found",
      type: "object",
      properties: {
        userId: { type: "string", format: "uuid" },
        username: { type: "string" },
        rank: { type: "integer" },
        elo: { type: "number" },
        total_players: { type: "integer" },
      },
    },
    400: {
      description: "Invalid UUID format",
      type: "object",
      properties: {
        message: { type: "string", example: "Invalid UUID" },
      },
    },
    404: {
      description: "User not found",
      type: "object",
      properties: {
        message: { type: "string", example: "User not found in ranking" },
      },
    },
  },
};

export default GetUserRankingSchema;
