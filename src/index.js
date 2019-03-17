// Imports
import express from 'express';

// App Imports
import setupLoadModules from './setup/load-modules';
import setupGraphQL from './setup/graphql';
import setupUpload from './setup/upload';
import setupStartServer from './setup/start-server';
import setupDownloads from './setup/download-archive';
import setupFeed from './setup/start-feed';

// Create express server
const server = express();

// Setup load modules
setupLoadModules(server);

// Setup uploads
setupUpload(server);

// Setup downloads
setupDownloads(server);

// Setup Feed
setupFeed(server);

// Setup GraphQL
setupGraphQL(server);

// Start server
setupStartServer(server);
