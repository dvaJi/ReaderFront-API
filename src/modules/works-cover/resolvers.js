import path from 'path';
import { Op } from 'sequelize';
// App Imports
import { createThumbnail, removeTempImage } from '../../setup/thumbnails';
import params from '../../config/params';
import models from '../../setup/models';

// Get WorksCovers by Work
export async function getByWork(parentValue, { workId }) {
  return await models.WorksCovers.findAll({
    where: {
      workId
    },
    include: [{ model: models.Works, as: 'work' }]
  });
}

export async function createCover(work, filename, isPortrait = false) {
  const workDir = work.stub + '_' + work.uniqid;
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
    workDir
  );

  if (isPortrait) {
    const thumb = await models.WorksCovers.findOne({
      where: {
        workId: work.id,
        coverTypeId: params.works.cover_type.portrait.id
      }
    });
    if (thumb) {
      const thumbDetails = thumb.get();
      await models.WorksCovers.destroy({ where: { id: thumbDetails.id } });
    }
  } else {
    await models.WorksCovers.findAll({
      where: {
        workId: work.id,
        coverTypeId: { [Op.not]: params.works.cover_type.portrait.id }
      }
    }).then(async thumbs => {
      thumbs.forEach(async thumb => {
        removeTempImage(path.join(newDir, thumb.filename));
        await models.WorksCovers.destroy({ where: { id: thumb.id } });
      });
    });
  }

  const coversTypes = Object.keys(params.works.cover_type)
    .filter(c => c !== 'portrait')
    .map(c => params.works.cover_type[c]);

  await coversTypes.map(coverType => {
    const thumb = createThumbnail(filename, tempDir, newDir, coverType);
    const coverThumb = {
      workId: work.id,
      filename: coverType.name + '_' + filename,
      coverTypeId: coverType.id,
      hidden: false,
      height: thumb.height,
      width: thumb.width,
      size: thumb.size,
      mime: thumb.format
    };
    models.WorksCovers.create(coverThumb);
    return coverThumb;
  });

  // Delete temp image
  removeTempImage(path.join(tempDir, filename));

  return coversTypes;
}

// Create WorksCovers
export async function create(parentValue, { workId, filename }, { auth }) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    const work = await models.Works.findOne({ where: { id: workId } });
    const workDetails = work.get();
    return await createCover(workDetails, filename);
  } else {
    throw new Error('Operation denied.');
  }
}

// Delete WorksCovers
export async function remove(parentValue, { id }, { auth }) {
  if (auth.user && auth.user.role === params.user.roles.admin) {
    const page = await models.WorksCovers.findOne({ where: { id } });

    if (!page) {
      // WorksCovers does not exists
      throw new Error('The WorksCovers does not exists.');
    } else {
      return await models.WorksCovers.destroy({ where: { id } });
    }
  } else {
    throw new Error('Operation denied.');
  }
}

// WorksCovers types
export async function getTypes() {
  return Object.values(params.works.cover_type);
}
