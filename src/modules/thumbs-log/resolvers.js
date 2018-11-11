import { Op } from 'sequelize';
import models from '../../setup/models';

// TODO: only admin can do this, add auth check
// getByOperation
// eslint-disable-next-line no-unused-vars
export async function getAll(parentValue) {
  return await models.ThumbsLog.findAll({ order: [['createdAt', 'DESC']] });
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

export async function getAllByDate(parentValue, { startDate, endDate }) {
  return await models.ThumbsLog.findAll({
    where: {
      updatedAt: {
        [Op.between]: [startDate, endDate]
      }
    }
  });
}

// Remove
export async function remove(parentValue, { id }) {
  const thumbLog = await models.ThumbsLog.findOne({ where: { id } });

  if (!thumbLog) {
    // Works does not exists
    throw new Error('The thumbLog does not exists.');
  } else {
    return await models.ThumbsLog.destroy({ where: { id } });
  }
}
