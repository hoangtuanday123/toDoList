const { generateApi } = require('swagger-typescript-api');
const path = require('path');
// const fs = require('fs');
// npx swagger-typescript-api -p http://localhost:8080/v3/api-docs  -o ./src/services -n api.ts

/* NOTE: all fields are optional expect one of `input`, `url`, `spec` */
generateApi({
  name: 'api.ts',
  output: path.resolve(process.cwd(), './src/services'),
  
  url: 'http://127.0.0.1:8080/openapi.json',
  httpClientType: 'axios', // or "fetch"
  generateClient: true,
  generateResponses: true,
  defaultResponseType: 'void',
  moduleNameFirstTag: true,
  primitiveTypeConstructs: (constructs) => ({
      ...constructs,
      string: {
        'date-time': 'Date'
      }
  }),
})
.catch(e => console.error(e))
