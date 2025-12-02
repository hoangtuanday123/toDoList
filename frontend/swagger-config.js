//npx swagger-typescript-api generate -p http://127.0.0.1:8000/api/openapi.json -o ./src/services -n api.ts --axios -r --default-response="void"  --module-name-first-tag --custom-config ./swagger-config.js
module.exports = {
  primitiveTypeConstructs: (constructs) => ({
    ...constructs,
    string: {
      'date-time': 'Date'
    }
  }),
};