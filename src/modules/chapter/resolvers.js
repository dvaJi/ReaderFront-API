// App Imports
import { removeTempImage, createThumbnail } from '../../setup/thumbnails';
import { generateChapterDir } from '../../setup/utils';
import params from '../../config/params';
import models from '../../setup/models';

// Get all chapters
export async function getAll(
  parentValue,
  { language, orderBy, first, offset }
) {
  const langWhere =
    language !== -1
      ? {
          where: { language }
        }
      : {};
  return await models.Chapter.findAll({
    langWhere,
    order: [['id', orderBy], [models.Page, 'filename']],
    include: [
      { model: models.Works, as: 'work' },
      { model: models.Page, as: 'pages' }
    ],
    offset: offset ? offset : 0,
    limit: first ? first : 10
  });
}

// Get chapter by work
export async function getByWork(parentValue, { workStub, language }) {
  const langWhere =
    language !== -1
      ? {
          where: { language }
        }
      : {};
  return await models.Chapter.findAll({
    langWhere,
    include: [
      { model: models.Works, as: 'work', where: { stub: workStub } },
      { model: models.Page, as: 'pages' }
    ],
    order: [[models.Page, 'filename']]
  });
}

// Get chapter by id
export async function getById(parentValue, { id }) {
  return await models.Chapter.findOne({
    where: { id },
    include: [
      { model: models.Works, as: 'work' },
      { model: models.Page, as: 'pages' }
    ],
    order: [[models.Page, 'filename']]
  });
}

// Create chapter
export async function create(
  parentValue,
  {
    workId,
    chapter,
    subchapter,
    volume,
    language,
    name,
    stub,
    uniqid,
    hidden,
    description,
    thumbnail
  },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    return await models.Chapter.create({
      workId,
      chapter,
      subchapter,
      volume,
      language,
      name,
      stub,
      uniqid,
      hidden,
      description,
      thumbnail
    });
  } else {
    throw new Error('Operation denied.');
  }
}

// Update chapter
export async function update(
  parentValue,
  {
    id,
    workId,
    chapter,
    subchapter,
    volume,
    language,
    name,
    stub,
    uniqid,
    hidden,
    description,
    thumbnail
  },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    return await models.Chapter.update(
      {
        workId,
        chapter,
        subchapter,
        volume,
        language,
        name,
        stub,
        uniqid,
        hidden,
        description,
        thumbnail
      },
      { where: { id } }
    );
  } else {
    throw new Error('Operation denied.');
  }
}

// Update chapter
export async function updateThumb(parentValue, { id, thumbnail }, { auth }) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    const chapter = await models.Chapter.findOne({
      where: { id },
      include: [{ model: models.Works, as: 'work' }]
    });
    const chapterDetail = await chapter.get();
    const coversTypes = Object.keys(params.works.cover_type)
      .filter(c => c !== 'portrait')
      .map(c => params.works.cover_type[c]);

    // delete old thumbnails
    if (chapterDetail.thumbnail !== null) {
      await coversTypes.forEach(async coverType => {
        const thumb = coverType.name + '_' + chapterDetail.thumbnail;
        const oldThumbPath = generateChapterDir(chapter, chapter.work, thumb);
        await removeTempImage(oldThumbPath);
      });
    }

    // Create new thumbs
    const chapterPath = generateChapterDir(chapter, chapter.work);
    await coversTypes.forEach(async coverType => {
      await createThumbnail(thumbnail, chapterPath, coverType, false);
      await createThumbnail(thumbnail, chapterPath, coverType, true);
    });

    return await models.Chapter.update(
      {
        thumbnail
      },
      { where: { id } }
    );
  } else {
    throw new Error('Operation denied.');
  }
}

// Delete chapter
export async function remove(parentValue, { id }, { auth }) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    const chapter = await models.Chapter.findOne({ where: { id } });

    if (!chapter) {
      // Chapter does not exists
      throw new Error('The chapter does not exists.');
    } else {
      return await models.Chapter.destroy({ where: { id } });
    }
  } else {
    throw new Error('Operation denied.');
  }
}

// Chapter types
export async function getTypes() {
  return Object.values(params.chapter.types);
}
