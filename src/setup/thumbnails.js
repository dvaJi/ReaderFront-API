import sharp from 'sharp';
import path from 'path';
import {
  copy,
  ensureDir,
  ensureFile,
  move,
  remove,
  exists,
  createReadStream
} from 'fs-extra';

/**
 * Generate a Thumbnail
 *
 * @param {*} filename
 * @param {*} inputDir
 * @param {*} outputDir
 * @param {*} type
 */
export async function createThumbnail(
  filename,
  thumbPath,
  type,
  isLowQuality = false
) {
  try {
    await ensureDir(thumbPath, err => {
      if (err) console.error(err);
    });

    const newImageDir = path.join(thumbPath, type.name + '_' + filename);

    // Check if the image already exist
    let thumbExist = false;
    await exists(newImageDir)
      .then(exists => {
        thumbExist = exists;
      })
      .catch(err => {
        console.error(err);
      });

    if (thumbExist && isLowQuality) {
      return await convertToWebp(thumbPath, type.name + '_' + filename);
    }

    if (thumbExist) {
      return await createReadStream(newImageDir);
    }

    await sharp(path.join(thumbPath, filename))
      .resize(type.width, type.height)
      .toFile(newImageDir)
      .then(data => {
        return data;
      })
      .catch(err => {
        console.error(err);
        return err;
      });

    if (isLowQuality) {
      return await convertToWebp(thumbPath, type.name + '_' + filename);
    }

    return await createReadStream(newImageDir);
  } catch (err) {
    console.error(err);
    return getDefaultThumbnail();
  }
}

export async function getOriginalImage(
  filename,
  thumbPath,
  isLowQuality = false
) {
  if (isLowQuality) {
    return await convertToWebp(thumbPath, filename);
  }

  return await createReadStream(path.join(thumbPath, filename));
}

/**
 * Convert image to webp
 *
 * @param {*} directory
 * @param {*} filename
 */
export async function convertToWebp(directory, filename) {
  try {
    const imagePath = path.join(directory, filename);
    const fileExtension = getFileExtension(filename);
    const newFilename = filename.replace(fileExtension, 'webp');
    const newImagePath = path.join(directory, newFilename);

    // Check if the webp image already exist
    let webpExists = false;
    await exists(newImagePath)
      .then(exists => {
        webpExists = exists;
      })
      .catch(err => {
        console.error(err);
      });

    if (webpExists) {
      return await createReadStream(newImagePath);
    }

    // Check if this image exist
    await ensureFile(imagePath, err => {
      if (err) console.error(err);
    });

    // If not, then create the webp image
    await sharp(imagePath)
      .webp()
      .toFile(newImagePath);

    return await createReadStream(newImagePath);
  } catch (err) {
    console.error(err);
    return getDefaultThumbnail();
  }
}

export async function getDefaultThumbnail() {
  const imagePath = path.join(
    __dirname,
    '..',
    '..',
    'public',
    'images',
    'default-cover.png'
  );
  return await createReadStream(imagePath);
}

/**
 * Delete a image
 *
 * @param {*} file
 */
export async function removeTempImage(file) {
  await ensureFile(file)
    .then(async () => {
      await remove(file, err => {
        if (err) return console.error(err);
      });
    })
    .catch(err => console.error(err));
}

/**
 * Move file
 * @param {*} oldDir
 * @param {*} newDir
 * @param {*} filename
 */
export async function moveImage(oldDir, newDir, filename) {
  try {
    await ensureDir(newDir, err => {
      if (err) console.error(err);
    });
    await move(path.join(oldDir, filename), path.join(newDir, filename));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * Move a directory
 *
 * @param {*} oldDir
 * @param {*} newDir
 */
export async function moveThumbnails(oldDir, newDir) {
  try {
    await copy(oldDir, newDir);
    await remove(oldDir);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * Check if path exist and then return it
 *
 * @param {*} type
 * @param {*} thumbPath
 */
export async function getThumbPath(type, thumbPath) {
  let newPath;
  switch (type) {
    case 'works':
      newPath = path.join(__dirname, '..', '..', 'public', 'works', thumbPath);
      try {
        await ensureDir(newPath);
        return newPath;
      } catch (err) {
        return null;
      }
    case 'blog':
      newPath = path.join(
        __dirname,
        '..',
        '..',
        'public',
        'images',
        'blog',
        thumbPath
      );
      try {
        await ensureDir(newPath);
        return newPath;
      } catch (err) {
        return null;
      }
    case 'chapter':
      newPath = path.join(__dirname, '..', '..', 'public', 'works', thumbPath);
      try {
        await ensureDir(newPath);
        return newPath;
      } catch (err) {
        return null;
      }
    default:
      console.error('Type ' + type + ' not found');
      return null;
  }
}

/**
 * Get extension from a file
 * @param {*} filename
 */
function getFileExtension(filename) {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
}
