import { Feed } from 'feed';
import compareDesc from 'date-fns/compare_desc';

// App Imports
import params from '../config/params.json';
import { getAllRSS } from '../modules/chapter/resolvers';
import { API_URL, APP_URL, REACT_APP_APP_TITLE } from '../config/env';

const languages = Object.keys(params.global.languages).map(
  lang => params.global.languages[lang]
);

// File upload configurations and route
export default function(server) {
  console.info('SETUP - RSS...');

  // Thumbnail route
  server.get('/feed/:feed/:lang', async (request, response) => {
    const language = request.params.lang;
    const feed = request.params.feed;
    let chapters = await getAllRSS({
      language,
      orderBy: 'DESC'
    });

    chapters = await chapters.sort((ch1, ch2) =>
      compareDesc(ch1.releaseDate, ch2.releaseDate)
    );
    const feedConfig = await generateFeed(chapters);

    response.type(feed);
    if (feed === 'atom') {
      response.send(feedConfig.atom1());
    } else if (feed === 'json') {
      response.send(feedConfig.json1());
    } else {
      response.send(feedConfig.rss2());
    }
  });
}

async function generateFeed(chapters) {
  const feedConfig = new Feed({
    title: REACT_APP_APP_TITLE,
    id: APP_URL,
    link: APP_URL,
    updated: chapters ? chapters[0].releaseDate : new Date(),
    generator: 'ReaderFront',
    author: {
      name: 'dvaJi',
      link: 'https://github.com/dvaJi'
    }
  });

  for (const chapter of chapters) {
    const title = generateChapterTitle(chapter);
    const url = generateChapterUrl(chapter, APP_URL);
    const thumb = generateThumbnailUrl(chapter, API_URL);
    await feedConfig.addItem({
      title: title,
      id: url,
      link: url,
      description: `<a href="${url}">${title}</a> - <a href="${thumb}">thumb</a>`,
      date: chapter.releaseDate,
      image: thumb
    });
  }

  return feedConfig;
}

function generateChapterTitle(chapter) {
  let title = chapter.work.name + ' C.' + chapter.chapter;

  if (chapter.subchapter !== 0) {
    title += '.' + chapter.subchapter;
  }

  if (chapter.name !== null && chapter.name !== '') {
    title += ': ' + chapter.name;
  }

  return title;
}

function generateChapterUrl(chapter, frontendBaseUrl) {
  const lang = languages.find(ln => ln.id === chapter.language);
  return (
    frontendBaseUrl +
    'read/' +
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
    'covers/chapter/' +
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
