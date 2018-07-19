// Imports
import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

// App Imports
import { PostType } from './types';
import { getAll, getByCategory } from './resolvers';

// Posts All
export const posts = {
  type: new GraphQLList(PostType),
  args: {
    language: { type: GraphQLInt },
    orderBy: { type: GraphQLString },
    first: { type: GraphQLInt },
    offset: { type: GraphQLInt }
  },
  resolve: getAll
};

// Post By Category
export const postsByCategory = {
  type: new GraphQLList(PostType),
  args: {
    categoryId: { type: GraphQLInt },
    language: { type: GraphQLInt },
    orderBy: { type: GraphQLString },
    first: { type: GraphQLInt },
    offset: { type: GraphQLInt }
  },
  resolve: getByCategory
};
