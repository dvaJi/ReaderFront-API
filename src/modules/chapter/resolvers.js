import uuidv1 from 'uuid/v1';

// App Imports
import {
  removeTempImage,
  createThumbnail,
  moveThumbnails,
  getThumbPath
} from '../../setup/thumbnails';
import { generateChapterDir } from '../../setup/utils';
import params from '../../config/params';
import models from '../../setup/models';

// Get all chapters
export async function getAll(
  parentValue,
  { language, orderBy, first, offset, showHidden }
) {
  return await models.Chapter.findAll({
    ...where(showHidden, language),
    order: [['releaseDate', orderBy], [models.Page, 'filename']],
    include: [
      { model: models.Works, as: 'work' },
      { model: models.Page, as: 'pages' }
    ],
    offset: offset ? offset : 0,
    limit: first ? first : 10
  });
}

// Get chapter by work
export async function getByWork(
  parentValue,
  { workStub, language, showHidden }
) {
  return await models.Chapter.findAll({
    ...where(showHidden, language),
    include: [
      { model: models.Works, as: 'work', where: { stub: workStub } },
      { model: models.Page, as: 'pages' }
    ],
    order: [[models.Page, 'filename']]
  });
}

// Get chapter by id
export async function getById(parentValue, { id, showHidden }) {
  const where = showHidden
    ? { where: { id } }
    : { where: { hidden: false, id } };
  return await models.Chapter.findOne({
    ...where,
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
    thumbnail,
    releaseDate
  },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    if (releaseDate === null) {
      releaseDate = new Date();
      uniqid = uuidv1();
    }
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
      thumbnail,
      releaseDate
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
    thumbnail,
    releaseDate
  },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    const chapterObj = await models.Chapter.findOne({
      where: { id },
      include: [{ model: models.Works, as: 'work' }]
    });
    const chapterDetail = await chapterObj.get();
    // Check if pages need to be moved
    if (
      chapter !== chapterDetail.chapter ||
      subchapter !== chapterDetail.subchapter ||
      stub !== chapterDetail.stub
    ) {
      const oldDir = await chapterDir(chapterDetail);
      const oldPath = await getThumbPath('chapter', oldDir);
      const newDir = await chapterDir({
        chapter,
        subchapter,
        stub,
        uniqid,
        work: {
          stub: chapterDetail.work.stub,
          uniqid: chapterDetail.work.uniqid
        }
      });
      const newPath = await getThumbPath('chapter', newDir);
      await moveThumbnails(oldPath, newPath);
    }
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
        thumbnail,
        releaseDate
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

function chapterDir(chapter) {
  return `${chapter.work.stub}_${chapter.work.uniqid}/${chapter.chapter}-${
    chapter.subchapter
  }_${chapter.stub}_${chapter.uniqid}`;
}

const where = (showHidden, language) => {
  if (showHidden && language === -1) {
    return {};
  }

  const oLanguage = language === -1 ? {} : { language };
  const sHidden = showHidden ? {} : { hidden: false };

  return { where: { ...sHidden, ...oLanguage } };
};
