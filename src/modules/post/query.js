// Imports
import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

// App Imports
import { PostType, PostsAggregatesType } from './types';
import { getAll, getByStub, getByCategory, getAggregates } from './resolvers';

// Posts All
export const posts = {
  type: new GraphQLList(PostType),
  args: {
    language: { type: GraphQLInt },
    orderBy: { type: GraphQLString },
    sortBy: { type: GraphQLString },
    first: { type: GraphQLInt },
    offset: { type: GraphQLInt }
  },
  resolve: getAll
};

// Posts by Stub
export const postByStub = {
  type: PostType,
  args: {
    stub: { type: GraphQLString }
  },
  resolve: getByStub
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

// Posts Aggregates
export const postsAggregates = {
  type: PostsAggregatesType,
  args: {
    aggregate: { type: GraphQLString },
    aggregateColumn: { type: GraphQLString },
    language: { type: GraphQLInt }
  },
  resolve: getAggregates
};
