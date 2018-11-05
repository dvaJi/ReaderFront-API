import { Feed } from 'feed';

// App Imports
import params from '../config/params.json';
import { getAll } from '../modules/chapter/resolvers';
import { getByName } from '../modules/preferences/resolvers';

const languages = Object.keys(params.global.languages).map(
  k => params.global.languages[k]
);

// File upload configurations and route
export default function(server) {
  console.info('SETUP - RSS...');

  // Thumbnail route
  server.get('/feed/rss/:lang', async (request, response) => {
    const baseUrl = request.protocol + '://' + request.get('host');
    const configFrontEnd = await getByName(undefined, {
      name: 'frontend_url'
    });
    const siteTitle = await getByName(undefined, {
      name: 'site_title'
    });
    const frontendBaseUrl = request.protocol + '://' + configFrontEnd + '/';
    const language = request.params.lang;
    const feedConfig = new Feed({
      title: siteTitle,
      id: frontendBaseUrl,
      link: frontendBaseUrl,
      updated: new Date(),
      generator: 'ReaderFront'
    });

    const chapters = await getAll(undefined, {
      language,
      orderBy: 'DESC',
      first: 10,
      offset: 0
    });

    for (const chapter of chapters) {
      await feedConfig.addItem({
        title: generateChapterTitle(chapter),
        id: generateChapterUrl(chapter, frontendBaseUrl),
        link: generateChapterUrl(chapter, frontendBaseUrl),
        description: chapter.description,
        /*author: [
          {
            name: 'MANGAKA',
          }
        ],*/
        date: chapter.updatedAt,
        image: generateThumbnailUrl(chapter, baseUrl)
      });
    }

    response.type('rss');
    response.send(feedConfig.rss2());
  });
}

function generateChapterTitle(chapter) {
  if (chapter.name !== null && chapter.name !== '') {
    return (
      chapter.work.name +
      ' V.' +
      chapter.volume +
      ' C.' +
      chapter.chapter +
      ': ' +
      chapter.name
    );
  } else {
    return chapter.work.name + ' V.' + chapter.volume + ' C.' + chapter.chapter;
  }
}

function generateChapterUrl(chapter, frontendBaseUrl) {
  const lang = languages.find(ln => ln.id === chapter.language);
  return (
    frontendBaseUrl +
    chapter.work.stub +
    '/' +
    lang.name +
    '/' +
    chapter.volume +
    '/' +
    chapter.chapter +
    '.' +
    chapter.subchapter
  );
}

function generateThumbnailUrl(chapter, baseUrl) {
  return (
    baseUrl +
    '/covers/chapter/' +
    chapter.work.stub +
    '_' +
    chapter.work.uniqid +
    '/' +
    chapter.stub +
    '_' +
    chapter.uniqid +
    '/' +
    chapter.thumbnail +
    '?size=medium'
  );
}
