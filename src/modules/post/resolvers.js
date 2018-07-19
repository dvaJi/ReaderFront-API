// App Imports
import params from '../../config/params';
import models from '../../setup/models';

// Get posts
export async function getAll(
  parentValue,
  { language, orderBy, first, offset }
) {
  return await models.Post.findAll({
    where: {
      language
    },
    order: [['id', orderBy]],
    include: [{ model: models.User, as: 'user' }],
    offset: offset,
    limit: first
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
    language
  },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
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
      language
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
    language
  },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
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
        language
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
      return await models.Post.destroy({ where: { id } });
    }
  } else {
    throw new Error('Operation denied.');
  }
}
