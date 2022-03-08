// Our date formats in ES isn't accepted by the graphql-scalar type DateTime as the info we put 
// into ES isn't RFC3339 https://datatracker.ietf.org/doc/html/rfc3339
// So instead I have created this temporary scalar that is really just a string
// From https://www.graphql-tools.com/docs/scalars
const { Kind, GraphQLScalarType } = require('graphql');

const DateTime = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      if (typeof value === 'string') {
        return value;
      }
      throw new Error('Not a valid DateTime (we only test that it is a string)');
    },
    serialize(value) {
      return '' + value; // value.getTime() // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;// new Date(+ast.value) // ast value is always in string format
      }
      return null
    }
  })
}

module.exports = DateTime;