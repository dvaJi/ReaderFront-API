// Imports
import { GraphQLString, GraphQLList } from 'graphql';

// App Imports
import { PreferenceType } from './types';
import { getAll, getByGroup } from './resolvers';

// Preferences All
export const preferences = {
  type: new GraphQLList(PreferenceType),
  resolve: getAll
};

// Preference By Group
export const preferencesByGroup = {
  type: new GraphQLList(PreferenceType),
  args: {
    group: { type: GraphQLString }
  },
  resolve: getByGroup
};
