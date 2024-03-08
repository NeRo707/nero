export = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Sweefty API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          in: "bearer",
          name: "Authorization",
          description: "Bearer access_token to access api endpoints",
          scheme: "bearer",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
