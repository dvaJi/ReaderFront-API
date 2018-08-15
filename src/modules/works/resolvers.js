import uuidv1 from 'uuid/v1';
import path from 'path';
import { Sequelize } from 'sequelize';
// App Imports
import { createCover as createWorkCover } from '../works-cover/resolvers';
import { createDescriptions } from '../works-description/resolvers';
import { moveThumbnails } from '../../setup/thumbnails';
import params from '../../config/params';
import models from '../../setup/models';

// Get all works
export async function getAll(
  parentValue,
  { language, orderBy, first, offset, sortBy }
) {
  const descriptionJoin =
    language !== -1
      ? {
          model: models.WorksDescription,
          as: 'works_descriptions',
          where: { language }
        }
      : {
          model: models.WorksDescription,
          as: 'works_descriptions'
        };
  return await models.Works.findAll({
    order: [[sortBy, orderBy]],
    offset: offset,
    limit: first,
    include: [
      {
        model: models.Chapter,
        as: 'chapters',
        include: [{ model: models.Page, as: 'pages' }]
      },
      descriptionJoin,
      {
        model: models.WorksCovers
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
}

// Get works by stub
export async function getByStub(parentValue, { stub, language }) {
  const descriptionJoin =
    language !== -1
      ? {
          model: models.WorksDescription,
          as: 'works_descriptions',
          where: { language }
        }
      : {
          model: models.WorksDescription,
          as: 'works_descriptions'
        };
  const works = await models.Works.findOne({
    where: { stub },
    include: [
      {
        model: models.Chapter,
        as: 'chapters',
        include: [{ model: models.Page, as: 'pages' }]
      },
      descriptionJoin,
      {
        model: models.WorksCovers
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

// Get works by ID
export async function getById(parentValue, { workId, language }) {
  const descriptionJoin =
    language !== -1
      ? {
          model: models.WorksDescription,
          as: 'works_descriptions',
          where: { language }
        }
      : {
          model: models.WorksDescription,
          as: 'works_descriptions'
        };
  const works = await models.Works.findOne({
    where: { id: workId },
    include: [
      descriptionJoin,
      {
        model: models.Chapter,
        as: 'chapters',
        include: [{ model: models.Page, as: 'pages' }]
      },
      {
        model: models.WorksCovers
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
export async function getRandom(parentValue, { language }) {
  const descriptionJoin =
    language !== -1
      ? {
          model: models.WorksDescription,
          as: 'works_descriptions',
          where: { language }
        }
      : {
          model: models.WorksDescription,
          as: 'works_descriptions'
        };
  return await models.Works.findOne({
    limit: 1,
    order: [[models.Sequelize.fn('RAND')]],
    include: [
      descriptionJoin,
      {
        model: models.Chapter,
        as: 'chapters',
        include: [{ model: models.Page, as: 'pages' }]
      },
      {
        model: models.WorksCovers
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
}

// Create works
export async function create(
  parentValue,
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
    visits
  },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
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
      visits
    });
  } else {
    throw new Error('Operation denied.');
  }
}

// Create works with cover
export async function createWithCover(
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
    cover,
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
      visits
    }).then(async work => {
      const workdetails = await work.get();
      const covers = createWorkCover(workdetails, cover);

      const descriptions = createDescriptions(
        works_descriptions,
        workdetails.id
      );

      workdetails.works_descriptions = descriptions;
      workdetails.work_covers = covers;

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
    cover,
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
        visits
      },
      { where: { id } }
    ).then(async () => {
      const oldWorkDetail = oldWork.get();
      const oldWorkDir = oldWorkDetail.stub + '_' + oldWorkDetail.uniqid;
      const oldDir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'public',
        'works',
        oldWorkDir
      );
      const workDir = stub + '_' + uniqid;
      const newDir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'public',
        'works',
        workDir
      );

      let isNewCover = false;
      const oldCover = await models.WorksCovers.findOne({
        where: {
          workId: id,
          coverTypeId: params.works.cover_type.small_thumb.id
        }
      });
      const oldCoverDetail = oldCover.get();
      isNewCover =
        cover !==
        oldCoverDetail.filename.replace(
          params.works.cover_type.small_thumb.name,
          ''
        );
      if (isNewCover && cover === null) {
        await moveThumbnails(oldDir, newDir);
      } else if (isNewCover) {
        const newWork = await models.Works.findOne({ where: { id } });
        await createWorkCover(newWork, cover);
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
  { aggregate, aggregateColumn, language }
) {
  const descriptionJoin =
    language !== -1
      ? {
          model: models.WorksDescription,
          as: 'works_descriptions',
          where: { language }
        }
      : {
          model: models.WorksDescription,
          as: 'works_descriptions'
        };
  let agg = 0;
  await models.Works.findAll({
    attributes: [
      [
        Sequelize.fn(aggregate, Sequelize.col('works.' + aggregateColumn)),
        aggregate.toLowerCase()
      ]
    ],
    include: [descriptionJoin]
  }).then(async aggs => {
    if (aggs.length > 0) {
      agg = await aggs[0].get()[aggregate.toLowerCase()];
    }
  });

  const result = {};
  result[aggregate.toLowerCase()] = agg;

  return result;
}
