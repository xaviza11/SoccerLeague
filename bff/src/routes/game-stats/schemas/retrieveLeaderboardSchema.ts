const RetrieveLeaderboardSchema = {
  $id: "RetrieveLeaderboard",
  tags: ["Ranking"],
  summary: "Get global leaderboard",
  description:
    "Retrieve a paginated list of players ranked by their ELO/stats.",

  querystring: {
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "integer",
        minimum: 1,
        description: "The page number",
        default: 1,
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 100,
        description: "Number of users per page",
        default: 10,
      },
    },
  },

  response: {
    200: {
      description: "Leaderboard retrieved successfully",
      type: "object",
      properties: {
        users: {
          type: "array",
          items: {
            type: "object",
            properties: {
              username: { type: "string" },
              elo: { type: "number" },
              rank: { type: "integer" },
            },
          },
        },
        total_pages: { type: "integer" },
        current_page: { type: "integer" },
      },
    },
    500: {
      description: "Internal Server Error",
      type: "object",
      properties: {
        message: { type: "string", example: "Error retrieving leaderboard" },
      },
    },
  },
};

export default RetrieveLeaderboardSchema;
