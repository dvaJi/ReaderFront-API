// Imports
import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

// Preference type
const PreferenceType = new GraphQLObjectType({
  name: 'preference',
  description: 'Preference Type',

  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    value: { type: GraphQLString },
    group: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
});

export { PreferenceType };
