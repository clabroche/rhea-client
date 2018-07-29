const fs = require('fs');
const result = {
  'data': {
    '__schema': {
      'types': [
        {
          'kind': 'OBJECT',
          'name': 'Query',
          'possibleTypes': null
        },
        {
          'kind': 'SCALAR',
          'name': 'ID',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': 'Account',
          'possibleTypes': null
        },
        {
          'kind': 'SCALAR',
          'name': 'String',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': 'Person',
          'possibleTypes': null
        },
        {
          'kind': 'ENUM',
          'name': 'EntityType',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': 'PostalAddress',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': 'Building',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': 'Level',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': 'Organization',
          'possibleTypes': null
        },
        {
          'kind': 'UNION',
          'name': 'Customers',
          'possibleTypes': [
            {
              'name': 'Organization'
            },
            {
              'name': 'Person'
            }
          ]
        },
        {
          'kind': 'OBJECT',
          'name': 'Role',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': 'Permission',
          'possibleTypes': null
        },
        {
          'kind': 'SCALAR',
          'name': 'Int',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': 'Mutation',
          'possibleTypes': null
        },
        {
          'kind': 'INPUT_OBJECT',
          'name': 'InputAccount',
          'possibleTypes': null
        },
        {
          'kind': 'INPUT_OBJECT',
          'name': 'InputPerson',
          'possibleTypes': null
        },
        {
          'kind': 'SCALAR',
          'name': 'Boolean',
          'possibleTypes': null
        },
        {
          'kind': 'INPUT_OBJECT',
          'name': 'InputRole',
          'possibleTypes': null
        },
        {
          'kind': 'INPUT_OBJECT',
          'name': 'InputOrganization',
          'possibleTypes': null
        },
        {
          'kind': 'INPUT_OBJECT',
          'name': 'InputPostalAddress',
          'possibleTypes': null
        },
        {
          'kind': 'INPUT_OBJECT',
          'name': 'InputBuilding',
          'possibleTypes': null
        },
        {
          'kind': 'INPUT_OBJECT',
          'name': 'InputLevel',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': '__Schema',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': '__Type',
          'possibleTypes': null
        },
        {
          'kind': 'ENUM',
          'name': '__TypeKind',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': '__Field',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': '__InputValue',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': '__EnumValue',
          'possibleTypes': null
        },
        {
          'kind': 'OBJECT',
          'name': '__Directive',
          'possibleTypes': null
        },
        {
          'kind': 'ENUM',
          'name': '__DirectiveLocation',
          'possibleTypes': null
        }
      ]
    }
  }
};
// here we're filtering out any type information unrelated to unions or interfaces
const filteredData = result.data.__schema.types.filter(
  type => type.possibleTypes !== null
);
result.data.__schema.types = filteredData;
fs.writeFile('./fragmentTypes.json', JSON.stringify(result.data), err => {
  if (err) {
    console.error('Error writing fragmentTypes file', err);
  } else {
    console.log('Fragment types successfully extracted!');
  }
});
