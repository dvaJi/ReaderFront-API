// Imports
import { GraphQLString, GraphQLInt } from 'graphql';

// App Imports
import { UserType } from './types';
import { create, remove, activate } from './resolvers';

// Create
export const userSignup = {
  type: UserType,
  args: {
    name: {
      name: 'name',
      type: GraphQLString
    },

    email: {
      name: 'email',
      type: GraphQLString
    },

    password: {
      name: 'password',
      type: GraphQLString
    }
  },
  resolve: create
};

// Activate
export const userActivate = {
  type: UserType,
  args: {
    email: {
      name: 'email',
      type: GraphQLString
    },

    activatedToken: {
      name: 'token',
      type: GraphQLString
    }
  },
  resolve: activate
};

// Remove
export const userRemove = {
  type: UserType,
  args: {
    id: {
      name: 'id',
      type: GraphQLInt
    }
  },
  resolve: remove
};
