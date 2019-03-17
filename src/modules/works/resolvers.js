import uuidv1 from 'uuid/v1';
import path from 'path';
import { Sequelize } from 'sequelize';

// App Imports
import { deleteImage, moveImage } from '../../setup/images-helpers';
import { createDescriptions } from '../works-description/resolvers';
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

const whereCond = showHidden => (showHidden ? {} : { hidden: false });

// Get all works
export async function getAll(
  parentValue,
  { language, orderBy, first, offset, sortBy, showHidden },
  req,
  { fieldNodes }
) {
  const fields = fieldNodes[0].selectionSet.selections.map(
    selection => selection.name.value
  );
  const includeChapters = fields.includes('chapters');
  const chapterJoin = includeChapters
    ? [
        {
          model: models.Chapter,
          ...where(showHidden, language),
          as: 'chapters',
          include: [{ model: models.Page, as: 'pages' }]
        }
      ]
    : [];

  return await models.Works.findAll({
    order: [[sortBy, orderBy]],
    offset: offset,
    limit: first,
    ...where(showHidden),
    include: [
      ...chapterJoin,
      descriptionJoin(language),
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
}

// Get works by stub
export async function getByStub(parentValue, { stub, language, showHidden }) {
  const works = await models.Works.findOne({
    where: { stub, ...whereCond(showHidden) },
    include: [
      {
        model: models.Chapter,
        ...where(showHidden, language),
        as: 'chapters',
        include: [{ model: models.Page, as: 'pages' }]
      },
      descriptionJoin(language),
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
  { fieldNodes }
) {
  const fields = fieldNodes[0].selectionSet.selections.map(
    selection => selection.name.value
  );
  const includeChapters = fields.includes('chapters');
  const chapterJoin = includeChapters
    ? [
        {
          model: models.Chapter,
          ...where(false, language),
          as: 'chapters',
          include: [{ model: models.Page, as: 'pages' }]
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
    works_descriptions
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

      const descriptions = createDescriptions(
        works_descriptions,
        workdetails.id
      );

      workdetails.works_descriptions = descriptions;

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
    works_descriptions
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
