// Imports
import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import GraphQLDate from 'graphql-date';

// Preference type
const PreferenceType = new GraphQLObjectType({
  name: 'preference',
  description: 'Preference Type',

  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    value: { type: GraphQLString },
    group: { type: GraphQLString },
    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate }
  })
});

export { PreferenceType };
