import uuidv1 from 'uuid/v1';

// App Imports
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

export async function getLast(parentValue, { offset }) {
  return await models.Chapter.findOne({
    order: [['updatedAt', 'DESC']],
    offset: offset,
    limit: 1
  });
}

export async function getAllByDate(parentValue, { startDate, endDate }) {
  const where = {
    updatedAt: {
      $between: [startDate, endDate]
    }
  };
  return await models.Chapter.findAll({
    where,
    include: [{ model: models.Page, as: 'pages' }]
  });
}

// Get chapter by work
export async function getByWork(
  parentValue,
  { workStub, language, showHidden },
  req,
  { fieldNodes }
) {
  const order = [['chapter', 'ASC'], ['subchapter', 'ASC']];
  const fields = fieldNodes[0].selectionSet.selections.map(
    selection => selection.name.value
  );
  const includePages = fields.includes('pages');
  const pages = includePages
    ? {
        join: [
          {
            model: models.Page,
            as: 'pages'
          }
        ],
        order: { order: [...order, [models.Page, 'filename']] }
      }
    : {
        join: [],
        order: { order: order }
      };
  return await models.Chapter.findAll({
    ...where(showHidden, language),
    include: [
      { model: models.Works, as: 'work', where: { stub: workStub } },
      ...pages.join
    ],
    ...pages.order
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

// Get chapter by work stub, chapter + subchapter + volume + language
export async function getWithPagesByWorkStubAndChapter(
  parentValue,
  { workStub, language, volume, chapter, subchapter, showHidden }
) {
  let where = { where: { chapter, subchapter, volume, language } };
  if (!showHidden) {
    where.where.hidden = false;
  }
  return await models.Chapter.findOne({
    ...where,
    include: [
      { model: models.Works, as: 'work', where: { stub: workStub } },
      { model: models.Page, as: 'pages' }
    ],
    order: [[models.Page, 'filename']]
  });
}

// Get all chapters for RSS
export async function getAllRSS({ language, orderBy, showHidden }) {
  return await models.Chapter.findAll({
    ...where(showHidden, language),
    order: [['releaseDate', orderBy]],
    include: [{ model: models.Works, as: 'work' }],
    offset: 0,
    limit: 25
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
    uniqid = uuidv1();
    if (releaseDate === null) {
      releaseDate = new Date();
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
export async function updateDefaultThumbnail(
  parentValue,
  { id, thumbnail },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
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

const where = (showHidden, language) => {
  const isAllLanguage = language === -1 || language === undefined;
  if (showHidden && isAllLanguage) {
    return {};
  }

  const oLanguage = isAllLanguage ? {} : { language };
  const sHidden = showHidden ? {} : { hidden: false };

  return { where: { ...sHidden, ...oLanguage } };
};
