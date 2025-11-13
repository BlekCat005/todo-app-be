import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN Todo API",
      version: "1.0.0",
      description: "RESTful API untuk aplikasi Todo dengan autentikasi JWT",
      contact: {
        name: "API Support",
        email: "support@todoapp.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "507f1f77bcf86cd799439011" },
            username: { type: "string", example: "johndoe" },
            email: { type: "string", example: "john@example.com" },
          },
        },
        Todo: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            title: { type: "string", example: "Belajar Node.js" },
            description: {
              type: "string",
              example: "Pelajari Express dan MongoDB",
            },
            completed: { type: "boolean", example: false },
            deadline: {
              type: "string",
              format: "date-time",
              example: "2025-12-31T23:59:59.000Z",
            },
            userId: { type: "string", example: "507f1f77bcf86cd799439011" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validasi gagal" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string", example: "email" },
                  message: {
                    type: "string",
                    example: "Format email tidak valid",
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Endpoints untuk autentikasi",
      },
      {
        name: "Todos",
        description: "Endpoints untuk mengelola todo",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "MERN Todo API Docs",
    })
  );
};

export default specs;
