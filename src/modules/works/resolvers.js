import uuidv1 from 'uuid/v1';
import path from 'path';
import { Sequelize, Op } from 'sequelize';

// App Imports
import { includesField } from '../../setup/utils';
import { deleteImage, moveImage } from '../../setup/images-helpers';
import { createDescriptions } from '../works-description/resolvers';
import { insertGenres } from '../works-genre/resolvers';
import { insertStaff } from '../people-works/resolvers';
import params from '../../config/params';
import models from '../../setup/models';

const where = (showHidden, language) => {
  const isAllLanguage = language === -1 || language === undefined;
  if (showHidden && isAllLanguage) {
    return {};
  }

  const oLanguage = isAllLanguage ? {} : { language };
  const sHidden = showHidden ? {} : { hidden: false };

  return { where: { ...sHidden, ...oLanguage } };
};

const whereChapter = (showHidden, language) => {
  const isAllLanguage = language === -1 || language === undefined;
  if (showHidden && isAllLanguage) {
    return {};
  }

  const oLanguage = isAllLanguage ? {} : { language };
  const sHidden = showHidden
    ? {}
    : { hidden: false, releaseDate: { [Op.lt]: new Date() } };

  return { where: { ...sHidden, ...oLanguage } };
};

const whereChapterWId = (showHidden, language, workId) => {
  const isAllLanguage = language === -1 || language === undefined;
  if (showHidden && isAllLanguage) {
    return { where: workId };
  }

  const oLanguage = isAllLanguage ? {} : { language };
  const sHidden = showHidden
    ? {}
    : { hidden: false, releaseDate: { [Op.lt]: new Date() } };

  return { where: { ...sHidden, ...oLanguage, workId } };
};

const whereCond = showHidden => (showHidden ? {} : { hidden: false });

// Get all works
export async function getAll(
  parentValue,
  { language, orderBy, first, offset, sortBy, showHidden },
  req,
  { fieldNodes = [] }
) {
  const includeChapters = includesField(fieldNodes, 'chapters');
  const chapterJoin = includeChapters
    ? [
        {
          model: models.Chapter,
          ...whereChapter(showHidden, language),
          as: 'chapters',
          order: [['chapter', 'DESC'], ['subchapter', 'DESC']],
          include: [{ model: models.Page, as: 'pages' }]
        }
      ]
    : [];

  const includePerson = includesField(fieldNodes, 'people_works');
  const personJoin = includePerson
    ? [
        {
          model: models.PeopleWorks,
          as: 'people_works',
          include: [{ model: models.People }]
        }
      ]
    : [];

  const includeGenres = includesField(fieldNodes, 'works_genres');
  const genresJoin = includeGenres
    ? [
        {
          model: models.WorksGenres
        }
      ]
    : [];

  return await models.Works.findAll({
    order: [[sortBy, orderBy]],
    offset: offset,
    limit: first,
    ...where(showHidden),
    include: [
      descriptionJoin(language),
      ...chapterJoin,
      ...genresJoin,
      ...personJoin
    ]
  });
}

// Get works by stub
export async function getByStub(
  parentValue,
  { stub, language, showHidden },
  req,
  { fieldNodes = [] }
) {
  // split queries
  // http://localhost:3000/work/goblin_slayer: actualmente toma 2.6 segundos
  const work = await models.Works.findOne({
    where: { stub, ...whereCond(showHidden) },
    include: [
      {
        model: models.WorksDescription,
        as: 'works_descriptions'
      },
      {
        model: models.WorksGenres
      }
    ]
  });

  if (!work) {
    // Works does not exists
    throw new Error('The works you are looking for does not exists.');
  } else {
    const hasChapter = includesField(fieldNodes, 'chapters');
    const chapters = hasChapter
      ? await models.Chapter.findAll({
          ...whereChapterWId(showHidden, language, work.id),
          order: [['chapter', 'DESC'], ['subchapter', 'DESC']]
        })
      : [];

    const hasPeople = includesField(fieldNodes, 'people_works');
    const people_works = hasPeople
      ? await models.PeopleWorks.findAll({
          where: { workId: work.id },
          include: [{ model: models.People }],
          order: [['rol', 'ASC']]
        })
      : [];

    const hasGenres = includesField(fieldNodes, 'works_genres');
    const works_genres = hasGenres
      ? await models.WorksGenres.findAll({
          where: { workId: work.id },
          order: [['genreId', 'ASC']]
        })
      : [];

    return { ...work.toJSON(), chapters, people_works, works_genres };
  }
}

// Get works by ID
export async function getById(parentValue, { workId, language }) {
  const works = await models.Works.findOne({
    where: { id: workId },
    include: [
      descriptionJoin(language),
      {
        model: models.Chapter,
        as: 'chapters',
        include: [{ model: models.Page, as: 'pages' }]
      },
      {
        model: models.WorksGenres
      },
      {
        model: models.PeopleWorks,
        as: 'people_works',
        include: [{ model: models.People }]
      }
    ]
  });

  if (!works) {
    // Works does not exists
    throw new Error('The works you are looking for does not exists.');
  } else {
    return works;
  }
}

// Get random work
export async function getRandom(
  parentValue,
  { language },
  req,
  { fieldNodes = [] }
) {
  const includeChapters = includesField(fieldNodes, 'chapters');
  const chapterJoin = includeChapters
    ? [
        {
          model: models.Chapter,
          ...whereChapter(false, language),
          as: 'chapters',
          order: [['chapter', 'DESC'], ['subchapter', 'DESC']],
          include: [{ model: models.Page, as: 'pages' }]
        }
      ]
    : [];

  const includePerson = includesField(fieldNodes, 'people_works');
  const personJoin = includePerson
    ? [
        {
          model: models.PeopleWorks,
          as: 'people_works',
          include: [{ model: models.People }]
        }
      ]
    : [];

  const includeGenres = includesField(fieldNodes, 'works_genres');
  const genresJoin = includeGenres
    ? [
        {
          model: models.WorksGenres
        }
      ]
    : [];

  return await models.Works.findOne({
    limit: 1,
    order: [[models.Sequelize.fn('RAND')]],
    where: { hidden: false },
    include: [
      descriptionJoin(language),
      ...chapterJoin,
      ...personJoin,
      ...genresJoin
    ]
  });
}

// Create works with cover
export async function create(
  parentValue,
  {
    name,
    stub,
    type,
    hidden,
    demographicId,
    status,
    statusReason,
    description,
    adult,
    visits,
    thumbnail,
    works_descriptions,
    works_genres,
    people_works
  },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    const uniqid = uuidv1();

    return await models.Works.create({
      name,
      stub,
      uniqid,
      type,
      hidden,
      demographicId,
      status,
      statusReason,
      description,
      adult,
      thumbnail,
      visits
    }).then(async work => {
      const workdetails = await work.get();
      await createWorkCover(workdetails, thumbnail);

      // Add descriptions
      workdetails.works_descriptions = await createDescriptions(
        works_descriptions,
        workdetails.id
      );

      // Add genres
      workdetails.works_genres = await insertGenres(
        workdetails.id,
        works_genres
      );

      // Add Staff
      await insertStaff(workdetails.id, people_works);

      return workdetails;
    });
  } else {
    throw new Error('Operation denied.');
  }
}

// Update works
export async function update(
  parentValue,
  {
    id,
    name,
    stub,
    uniqid,
    type,
    hidden,
    demographicId,
    status,
    statusReason,
    description,
    adult,
    visits,
    thumbnail,
    works_descriptions,
    works_genres,
    people_works
  },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    const oldWork = await models.Works.findOne({ where: { id } });
    return await models.Works.update(
      {
        name,
        stub,
        uniqid,
        type,
        hidden,
        demographicId,
        status,
        statusReason,
        description,
        adult,
        thumbnail,
        visits
      },
      { where: { id } }
    ).then(async () => {
      const oldWorkDetail = oldWork.get();
      const isNewCover = thumbnail !== oldWorkDetail.thumbnail;
      if (isNewCover) {
        const newWork = await models.Works.findOne({ where: { id } });
        await createWorkCover(newWork, thumbnail);
      }

      await createDescriptions(works_descriptions, id);

      // Add genres
      await insertGenres(id, works_genres);

      // Add Staff
      await insertStaff(id, people_works);
    });
  } else {
    throw new Error('Operation denied.');
  }
}

// Delete works
export async function remove(parentValue, { id }, { auth }) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    const works = await models.Works.findOne({ where: { id } });

    if (!works) {
      // Works does not exists
      throw new Error('The works does not exists.');
    } else {
      return await models.Works.destroy({ where: { id } });
    }
  } else {
    throw new Error('Operation denied.');
  }
}

// Works Status types
export async function getStatusTypes() {
  return Object.values(params.works.status);
}

// Get all work aggregates
export async function getAggregates(
  parentValue,
  { aggregate, aggregateColumn, language, showHidden }
) {
  let agg = 0;
  await models.Works.findAll({
    ...where(showHidden),
    attributes: [
      [
        Sequelize.fn(aggregate, Sequelize.col('works.' + aggregateColumn)),
        aggregate.toLowerCase()
      ]
    ],
    include: [descriptionJoin(language)]
  }).then(async aggs => {
    if (aggs.length > 0) {
      agg = await aggs[0].get()[aggregate.toLowerCase()];
    }
  });

  const result = {};
  result[aggregate.toLowerCase()] = agg;

  return result;
}

export async function createWorkCover(work, filename) {
  const tempDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'public',
    'images',
    'uploads'
  );
  const newDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'public',
    'works',
    work.uniqid
  );

  await moveImage(tempDir, newDir, filename);

  // Delete temp image
  await deleteImage(path.join(tempDir, filename));

  return true;
}

const descriptionJoin = lang =>
  lang !== -1
    ? {
        model: models.WorksDescription,
        as: 'works_descriptions',
        where: { language: lang }
      }
    : {
        model: models.WorksDescription,
        as: 'works_descriptions'
      };
