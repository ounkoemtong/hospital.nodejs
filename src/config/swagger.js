import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hospital API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Hospital Management System backend',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.js'],
};

const specs = swaggerJsdoc(options);

// 🛠 ប្រើប្រាស់ Default Export វិញ
const swaggerConfig = {
  swaggerUi,
  specs,
};

export default swaggerConfig;