const fetch = require('node-fetch');
const fs = require('fs');

const url = process.env.GRAPHQL_URI || '/graphql';

let headers = { 'Content-Type': 'application/json' };
if (typeof(process.env.AUTHORIZATION) != 'undefined') {
  headers['Authorization'] = process.env.AUTORIZATION;
}

fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify({
    variables: {},
    headers: headers,
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
})
  .then(result => result.json())
  .then(result => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      type => type.possibleTypes !== null,
    );
    result.data.__schema.types = filteredData;
    fs.writeFileSync('./src/fragmentTypes.json', JSON.stringify(result.data), err => {
      if (err) {
        console.error('Error writing fragmentTypes file', err);
      } else {
        console.log('Fragment types successfully extracted!');
      }
    });
  });
