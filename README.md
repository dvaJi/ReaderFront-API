# ReaderFront API

[![Greenkeeper badge](https://badges.greenkeeper.io/dvaJi/ReaderFront-API.svg)](https://greenkeeper.io/)

#### A comic reader meant for users to enjoy reading

- **API** built with Node, GraphQL, Express, Sequelize (MySQL) and JWT Auth
- [**WebApp** built with React and Redux along ~~(soon) with Server Side Rendering (SSR) / SEO friendly~~](https://github.com/dvaJi/ReaderFront)

## Installation

- Prerequisites
  - Node
  - MySQL (or Postgres / Sqlite / MSSQL)
- Clone repo `git clone git@github.com:dvaJi/ReaderFront-API.git ReaderFront-API`
- Switch to `ReaderFront-API` directory `cd ReaderFront-API`
- Configurations
  - Modify `/.env.example` to configurate the app (IMPORTANT) (you should rename it to `/.env`)
- Setup
  - API: Install packages and database setup (migrations and seed) `npm run setup`
- Development
  - Run API `npm start`, browse GraphiQL at http://localhost:8000/
  - Run [Webapp](https://github.com/dvaJi/ReaderFront) `go to ReaderFront directory` and `npm start`, browse webapp at http://localhost:3000/
- Production
  - Run API `npm run start:prod`, creates an optimized build in `build` directory and runs the server
  - Run [Webapp](https://github.com/dvaJi/ReaderFront) `go to ReaderFront directory` and `npm run build`, creates an optimized build in `build` directory

## Core Structure

      │── public            static files endpoint
      │── src
      │   ├── config        params, server and database configurations
      │   ├── migrations    sequelize migrations
      │   ├── modules       modules containing queries, mutations, models, etc.
      │   ├── seeders       sequelize seeders
      │   └── setup         setup configurations, modules and start server
      │── index.js
      │── package.json
      ├── .gitignore
      └── README.md

## FAQ

...

## License

MIT
