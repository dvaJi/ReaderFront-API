import { Op } from 'sequelize';
import path from 'path';
import { remove as removeFS } from 'fs-extra';

import models from '../../setup/models';

// TODO: only admin can do this, add auth check
// eslint-disable-next-line no-unused-vars
export async function getAll() {
  return await models.ThumbsLog.findAll({ order: [['createdAt', 'DESC']] });
}

export async function getByChapterAndFilename(_, { filename, chapterDir }) {
  return await models.ThumbsLog.findOne({
    where: {
      filename: {
        [Op.like]: filename + '%'
      },
      chapterDir
    }
  });
}

export async function getAllByDate(_, { startDate, endDate }) {
  return await models.ThumbsLog.findAll({
    where: {
      updatedAt: {
        [Op.between]: [startDate, endDate]
      }
    }
  });
}

// Create Thumb log
export async function create(
  parentValue,
  { filename, size, workDir, chapterDir }
) {
  return await models.ThumbsLog.create({
    filename,
    size,
    workDir,
    chapterDir
  });
}

// Remove
export async function remove(parentValue, { id }) {
  const thumbLog = await models.ThumbsLog.findOne({ where: { id } });

  if (!thumbLog) {
    // Works does not exists
    throw new Error('The thumbLog does not exists.');
  } else {
    const thumb = thumbLog.get();

    // Delete the file first
    const fullPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'works',
      thumb.workDir,
      thumb.chapterDir,
      thumb.filename
    );

    await removeFS(fullPath);

    return await models.ThumbsLog.destroy({ where: { id } });
  }
}
