'use-strict'

import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Tasks-CBW',
      version: '1.0.0',
      description: 'API documentation for your Node.js application',
    },
  },
  apis: ['../controllers/TaskController.ts'], // Path to the API routes, adjust as needed
};
let swaggerSpec=null
try{
   swaggerSpec = swaggerJSDoc(options);
}catch(e){
  console.log(e)
   swaggerSpec = {}
}
export { swaggerSpec,options }