// Imports
import { GraphQLString, GraphQLInt } from 'graphql';

// App Imports
import { PreferenceType } from './types';
import { update } from './resolvers';

// Preference update
export const preferenceUpdate = {
  type: PreferenceType,
  args: {
    id: {
      name: 'id',
      type: GraphQLInt
    },

    name: {
      name: 'name',
      type: GraphQLString
    },

    value: {
      name: 'value',
      type: GraphQLString
    },

    group: {
      name: 'group',
      type: GraphQLString
    }
  },
  resolve: update
};
