import path from 'path';

// App Imports
import {
  createThumbnail,
  getThumbPath,
  getDefaultThumbnail,
  getOriginalImage
} from './thumbnails';
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

    if (size === 'original') {
      let coverPath = await getThumbPath(type, directory);
      return getOriginalImage(filename, coverPath, isLowQuality).then(img =>
        img.pipe(response)
      );
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
      return createThumbnail(filename, coverPath, coverType, isLowQuality).then(
        img => img.pipe(response)
      );
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

      if (size === 'original') {
        let coverPath = await getThumbPath(type, directory);
        return getOriginalImage(filename, coverPath, isLowQuality).then(img =>
          img.pipe(response)
        );
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
          isLowQuality
        ).then(img => img.pipe(response));
      }

      return getDefaultThumbnail().then(img => img.pipe(response));
    }
  );
}
