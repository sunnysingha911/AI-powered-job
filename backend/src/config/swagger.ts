import swaggerJSDoc from "swagger-jsdoc"

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Job Tracker API",
      version: "1.0.0",
      description: "API documentation for AI-powered Job Tracker backend",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local development server",
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
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            error: { type: "string" },
            stack: { type: "string" },
          },
        },
        Resume: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            title: { type: "string" },
            fileUrl: { type: "string" },
            atsScore: { type: "integer", nullable: true },
          },
        },
        Job: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            company: { type: "string" },
            location: { type: "string", nullable: true },
            jobType: {
              type: "string",
              enum: [
                "FULL_TIME",
                "PART_TIME",
                "CONTRACT",
                "INTERNSHIP",
                "FREELANCE",
              ],
            },
          },
        },
        Application: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            jobId: { type: "string", format: "uuid" },
            status: {
              type: "string",
              enum: [
                "APPLIED",
                "SCREENING",
                "INTERVIEW",
                "OFFER",
                "REJECTED",
                "ACCEPTED",
                "WITHDRAWN",
              ],
            },
          },
        },
      },
    },
  },
  apis: ["src/**/*.ts"],
}

export const swaggerSpec = swaggerJSDoc(swaggerOptions)
