import { Sequelize } from 'sequelize';
import path from 'path';
import uuidv1 from 'uuid/v1';

// App Imports
import { moveImage, removeTempImage } from '../../setup/thumbnails';
import params from '../../config/params';
import models from '../../setup/models';

// Get posts
export async function getAll(
  parentValue,
  { language, orderBy, sortBy, first, offset }
) {
  const languageFilter = language !== -1 ? { language: language } : {};
  return await models.Post.findAll({
    where: languageFilter,
    order: [[sortBy, orderBy]],
    include: [{ model: models.User, as: 'user' }],
    offset: offset,
    limit: first
  });
}

// Get post by stub
export async function getByStub(parentValue, { stub }) {
  return await models.Post.findOne({
    where: {
      stub
    },
    include: [{ model: models.User, as: 'user' }]
  });
}

// Get posts by category
export async function getByCategory(
  parentValue,
  { categoryId, language, orderBy, first, offset }
) {
  return await models.Post.findAll({
    where: {
      language,
      category: categoryId
    },
    order: [['id', orderBy]],
    include: [{ model: models.User, as: 'user' }],
    offset: offset,
    limit: first
  });
}

// Create post
export async function create(
  parentValue,
  {
    userId,
    uniqid,
    type,
    title,
    stub,
    status,
    sticky,
    content,
    category,
    language,
    thumbnail
  },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    uniqid = uuidv1();
    if (thumbnail) {
      const postDir = stub + '_' + uniqid;
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
        'images',
        'blog',
        postDir
      );

      await moveImage(tempDir, newDir, thumbnail);
    }
    return await models.Post.create({
      userId,
      uniqid,
      type,
      title,
      stub,
      status,
      sticky,
      content,
      category,
      language,
      thumbnail
    });
  } else {
    throw new Error('Operation denied.');
  }
}

// Update post
export async function update(
  parentValue,
  {
    id,
    userId,
    uniqid,
    type,
    title,
    stub,
    status,
    sticky,
    content,
    category,
    language,
    thumbnail
  },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    const post = await models.Post.findOne({
      where: {
        id: id
      }
    });
    const postDetail = await post.get();
    if (thumbnail !== postDetail.thumbnail) {
      const postDir = stub + '_' + uniqid;
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
        'images',
        'blog',
        postDir
      );

      await moveImage(tempDir, newDir, thumbnail);
    }
    return await models.Post.update(
      {
        userId,
        uniqid,
        type,
        title,
        stub,
        status,
        sticky,
        content,
        category,
        language,
        thumbnail
      },
      { where: { id } }
    );
  } else {
    throw new Error('Operation denied.');
  }
}

// Delete post
export async function remove(parentValue, { id }, { auth }) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    const post = await models.Post.findOne({ where: { id } });

    if (!post) {
      // Post does not exists
      throw new Error('The post does not exists.');
    } else {
      const postDetail = await post.get();
      if (postDetail.thumbnail) {
        const postDir = postDetail.stub + '_' + postDetail.uniqid;
        const directory = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'public',
          'images',
          'blog',
          postDir,
          postDetail.thumbnail
        );
        await removeTempImage(directory);
      }
      return await models.Post.destroy({ where: { id } });
    }
  } else {
    throw new Error('Operation denied.');
  }
}

// Get all posts aggregates
export async function getAggregates(
  parentValue,
  { aggregate, aggregateColumn, language }
) {
  const languageFilter =
    language !== -1
      ? {
          where: { language }
        }
      : {};
  let agg = 0;
  await models.Post.findAll({
    attributes: [
      [
        Sequelize.fn(aggregate, Sequelize.col('posts.' + aggregateColumn)),
        aggregate.toLowerCase()
      ]
    ],
    languageFilter
  }).then(async aggs => {
    if (aggs.length > 0) {
      agg = await aggs[0].get()[aggregate.toLowerCase()];
    }
  });

  const result = {};
  result[aggregate.toLowerCase()] = agg;

  return result;
}
