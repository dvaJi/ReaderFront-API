// Imports
import { GraphQLObjectType } from 'graphql';

// App Imports
import * as user from '../../modules/user/query';
import * as works from '../../modules/works/query';
import * as worksDescription from '../../modules/works-description/query';
import * as WorksGenre from '../../modules/works-genre/query';
import * as worksCover from '../../modules/works-cover/query';
import * as chapter from '../../modules/chapter/query';
import * as page from '../../modules/page/query';
import * as people from '../../modules/people/query';

// Query
const query = new GraphQLObjectType({
  name: 'query',
  description: 'API Queries [Read]',
  fields: () => ({
    ...user,
    ...works,
    ...chapter,
    ...page,
    ...worksDescription,
    ...WorksGenre,
    ...worksCover,
    ...people
  })
});

export default query;
