// Imports
import graphqlHTTP from 'express-graphql';
import depthLimit from 'graphql-depth-limit';

// App Imports
import serverConfig from '../config/server.json';
import authentication from './authentication';
import schema from './schema';

// Setup GraphQL
export default function(server) {
  console.info('SETUP - GraphQL...');

  server.use(authentication);

  // API (GraphQL on route `/`)
  server.use(
    serverConfig.graphql.endpoint,
    graphqlHTTP(request => ({
      schema,
      graphiql: serverConfig.graphql.ide,
      pretty: serverConfig.graphql.pretty,
      validationRules: [depthLimit(10)],
      context: {
        auth: {
          user: request.user,
          isAuthenticated: request.user && request.user.id > 0
        },
        clientIp: request.ip
      }
    }))
  );
}
