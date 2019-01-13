import path from 'path';

// App Imports
import {
  getByChapterAndFilename as getThumbLog,
  remove as removeThumbLog
} from '../thumbs-log/resolvers';
import { moveImage, removeTempImage } from '../../setup/thumbnails';
import params from '../../config/params';
import models from '../../setup/models';
import { getFileExtension } from '../../setup/utils';

// Get pages by chapter
export async function getByChapter(parentValue, { chapterId }) {
  return await models.Page.findAll({
    where: {
      chapterId: chapterId
    },
    include: [{ model: models.Chapter, as: 'chapter' }]
  });
}

// Create page
export async function create(
  parentValue,
  { chapterId, filename, hidden, height, width, size, mime },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    const chapter = await models.Chapter.findOne({
      where: {
        id: chapterId
      },
      include: [{ model: models.Works, as: 'work' }]
    });
    const chapterDetails = chapter.get();
    const oldDir = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'images',
      'uploads'
    );
    const workDir = chapterDetails.work.stub + '_' + chapterDetails.work.uniqid;
    const chapDir = chapterDetails.stub + '_' + chapterDetails.uniqid;
    const newDir = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'works',
      workDir,
      chapDir
    );
    await moveImage(oldDir, newDir, filename);
    return await models.Page.create({
      chapterId,
      filename,
      hidden,
      height,
      width,
      size,
      mime
    });
  } else {
    throw new Error('Operation denied.');
  }
}

// Update page
export async function update(
  parentValue,
  { id, chapterId, filename, hidden, height, width, size, mime },
  { auth }
) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    return await models.Page.update(
      {
        chapterId,
        filename,
        hidden,
        height,
        width,
        size,
        mime
      },
      { where: { id } }
    );
  } else {
    throw new Error('Operation denied.');
  }
}

// Delete page
export async function remove(parentValue, { id }, { auth }) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    const page = await models.Page.findOne({ where: { id } });
    if (!page) {
      // Page does not exists
      throw new Error('The page does not exists.');
    } else {
      const pageDetails = await page.get();
      const chapter = await models.Chapter.findOne({
        where: {
          id: pageDetails.chapterId
        },
        include: [{ model: models.Works, as: 'work' }]
      });
      const chapterDetails = await chapter.get();
      // TODO: Helpers to avoid creating dir every time
      const workDir =
        chapterDetails.work.stub + '_' + chapterDetails.work.uniqid;
      const chapDir = chapterDetails.stub + '_' + chapterDetails.uniqid;
      const pageDir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'public',
        'works',
        workDir,
        chapDir
      );
      await removeTempImage(path.join(pageDir, pageDetails.filename));

      // Try to find and delete the image from thumbs_logs
      try {
        const fileExtension = getFileExtension(pageDetails.filename);
        const newFilename = pageDetails.filename.replace(fileExtension, 'webp');
        const thumblog = await getThumbLog(undefined, {
          filename: newFilename,
          chapterDir: chapDir
        });
        const thumblogDetail = thumblog.get();

        await removeThumbLog(undefined, { id: thumblogDetail.id });
      } catch (err) {
        console.log(err);
      }

      return await models.Page.destroy({ where: { id } });
    }
  } else {
    throw new Error('Operation denied.');
  }
}

export async function getLatestPage(chapterId) {
  return await models.Page.findOne({
    where: { chapterId },
    limit: 1,
    order: [['createdAt', 'DESC']]
  });
}

// Page types
export async function getTypes() {
  return Object.values(params.page.types);
}
