// Imports
import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

// App Imports
import { ChapterType } from './types';
import { getAll, getByWork, getById } from './resolvers';

// Chapters All
export const chapters = {
  type: new GraphQLList(ChapterType),
  args: {
    language: { type: GraphQLInt },
    orderBy: { type: GraphQLString },
    first: { type: GraphQLInt },
    offset: { type: GraphQLInt }
  },
  resolve: getAll
};

// Chapter By Work
export const chaptersByWork = {
  type: new GraphQLList(ChapterType),
  args: {
    workStub: { type: GraphQLString },
    language: { type: GraphQLInt }
  },
  resolve: getByWork
};

// Chapter By ID
export const chapterById = {
  type: ChapterType,
  args: {
    id: { type: GraphQLInt }
  },
  resolve: getById
};
