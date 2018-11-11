import path from 'path';
import { remove } from 'fs-extra';

// App imports
import {
  getAllByDate as ThumbLog,
  remove as removeThumbLog
} from '../modules/thumbs-log/resolvers';

/**
 * Clean all thumbs with a start and end date
 * @param {Date} startDate
 * @param {Date} endDate
 */
export async function cleanThumbs(startDate, endDate) {
  const thumbslogs = await ThumbLog(undefined, { startDate, endDate });
  for (const thumb of thumbslogs) {
    const fullPath = path.join(thumb.workDir, thumb.chapterDir, thumb.filename);
    await removeChapterThumbs(thumb.id, fullPath);
  }
}

/**
 * Delete thumbs from ThumbLog
 * @param {Number} thumblogId
 * @param {string} fullPath
 */
async function removeChapterThumbs(thumblogId, fullPath) {
  // Remove original thumb
  try {
    await remove(path.join(__dirname, '..', '..', 'public', 'works', fullPath));
    // Delete from database
    await removeThumbLog(undefined, { id: thumblogId });
  } catch (err) {
    console.error(err);
  }
}
