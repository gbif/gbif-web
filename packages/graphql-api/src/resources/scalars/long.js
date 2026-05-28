// via https://github.com/chadlieberman/graphql-type-long/blob/master/lib/index.js
import { Kind, GraphQLScalarType } from 'graphql';

const coerceLong = (value) => {
  if (value === '') {
    throw new TypeError(
      'Long cannot represent non 52-bit signed integer value: (empty string)',
    );
  }
  const num = Number(value);
  if (num <= Number.MAX_SAFE_INTEGER && num >= Number.MIN_SAFE_INTEGER) {
    if (num < 0) {
      return Math.ceil(num);
    }
    return Math.floor(num);
  }
  throw new TypeError(
    `Long cannot represent non 52-bit signed integer value: ${String(value)}`,
  );
};

const parseLiteral = (ast) => {
  let num;
  if (ast.kind === Kind.INT) {
    num = parseInt(ast.value, 10);
    if (num <= Number.MAX_SAFE_INTEGER && num >= Number.MIN_SAFE_INTEGER) {
      return num;
    }
  }
  return null;
};

const GraphQLLong = new GraphQLScalarType({
  name: 'Long',
  description: 'The `Long` scalar type represents 52-bit integers',
  serialize: coerceLong,
  parseValue: coerceLong,
  parseLiteral,
});

export default GraphQLLong;
