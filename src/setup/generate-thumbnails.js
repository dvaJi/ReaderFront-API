import path from 'path';
import subDays from 'date-fns/sub_days';
import subYears from 'date-fns/sub_years';

// App Imports
import {
  createThumbnail,
  getThumbPath,
  getDefaultThumbnail,
  getOriginalImage
} from './thumbnails';
import { cleanThumbs } from './operations';
import params from '../config/params.json';

// File upload configurations and route
export default function(server) {
  console.info('SETUP - Thumbnails Generator...');

  // Thumbnail route
  server.get('/covers/:type/:dir/:filename', async (request, response) => {
    const type = request.params.type;
    const directory = request.params.dir;
    const filename = request.params.filename;
    const isLowQuality = request.query.lowQuality === 'true';
    const size = request.query.size;
    const directoryObj = {
      workDir: request.params.dir,
      chapterDir: ''
    };

    if (size === 'original') {
      let coverPath = await getThumbPath(type, directory);
      return getOriginalImage(
        filename,
        coverPath,
        isLowQuality,
        directoryObj
      ).then(img => img.pipe(response));
    }

    const coversTypes = Object.keys(params.works.cover_type).map(
      k => params.works.cover_type[k]
    );
    const coverType = coversTypes.find(
      coverType => coverType.name === size + '_thumb'
    );

    // If cover type is not found, then return a default image
    if (coverType === undefined) {
      return getDefaultThumbnail().then(img => img.pipe(response));
    }

    let coverPath = await getThumbPath(type, directory);

    if (coverPath) {
      return createThumbnail(
        filename,
        coverPath,
        coverType,
        isLowQuality,
        directoryObj
      ).then(img => img.pipe(response));
    }

    return getDefaultThumbnail().then(img => img.pipe(response));
  });

  /**
   * Chapters route
   */
  server.get(
    '/covers/:type/:workDir/:dir/:filename',
    async (request, response) => {
      const type = request.params.type;
      const directory = path.join(request.params.workDir, request.params.dir);
      const filename = request.params.filename;
      const isLowQuality = request.query.lowQuality === 'true';
      const size = request.query.size;
      const directoryObj = {
        workDir: request.params.workDir,
        chapterDir: request.params.dir
      };

      if (size === 'original') {
        let coverPath = await getThumbPath(type, directory);
        return getOriginalImage(
          filename,
          coverPath,
          isLowQuality,
          directoryObj
        ).then(img => img.pipe(response));
      }

      const coversTypes = Object.keys(params.works.cover_type).map(
        k => params.works.cover_type[k]
      );
      const coverType = coversTypes.find(
        coverType => coverType.name === size + '_thumb'
      );

      // If cover type is not found, then return a default image
      if (coverType === undefined) {
        return getDefaultThumbnail().then(img => img.pipe(response));
      }

      let coverPath = await getThumbPath(type, directory);

      if (coverPath) {
        return createThumbnail(
          filename,
          coverPath,
          coverType,
          isLowQuality,
          directoryObj
        ).then(img => img.pipe(response));
      }

      return getDefaultThumbnail().then(img => img.pipe(response));
    }
  );

  server.get('/clean/:days', async (request, response) => {
    const daysToPreserve = parseInt(request.params.days, 0) || 7;
    const endDate = subDays(new Date(), daysToPreserve);
    const startDate = subYears(endDate, 1);

    await cleanThumbs(startDate, endDate);

    response.send('Done!');
  });
}
