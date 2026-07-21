import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Skinclinic API",
      version: "1.0.0",
      description:
        "API interna para gestión de clínica de belleza, cosmetología y depilación láser.",
    },
    servers: [
      {
        url: "/api",
        description: "Servidor local vía proxy de Vite",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
