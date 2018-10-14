// Imports
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';
import GraphQLDate from 'graphql-date';

// App Imports
import { UserType } from '../user/types';

// Post type
const PostType = new GraphQLObjectType({
  name: 'post',
  description: 'Post Type',

  fields: () => ({
    id: { type: GraphQLInt },
    user: { type: UserType },
    uniqid: { type: GraphQLString },
    type: { type: GraphQLInt },
    title: { type: GraphQLString },
    stub: { type: GraphQLString },
    content: { type: GraphQLString },
    category: { type: GraphQLInt },
    status: { type: GraphQLInt },
    sticky: { type: GraphQLBoolean },
    language: { type: GraphQLInt },
    thumbnail: { type: GraphQLString },
    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate }
  })
});

// Posts status type
const PostsAggregatesType = new GraphQLObjectType({
  name: 'postAggregatesType',
  description: 'Post Aggregates Type',

  fields: () => ({
    count: { type: GraphQLInt },
    sum: { type: GraphQLInt },
    max: { type: GraphQLInt },
    min: { type: GraphQLInt }
  })
});

export { PostType, PostsAggregatesType };
