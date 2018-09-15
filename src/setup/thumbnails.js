import sharp from 'sharp';
import path from 'path';
import { copy, ensureDir, ensureFile, move, remove } from 'fs-extra';

export async function createThumbnail(filename, inputDir, outputDir, type) {
  await ensureDir(outputDir, err => {
    if (err) console.error(err);
  });

  const newImageDir = path.join(outputDir, type.name + '_' + filename);

  await sharp(path.join(inputDir, filename))
    .rotate()
    .resize(type.width, type.height)
    .toFile(newImageDir)
    .then(data => {
      return data;
    })
    .catch(err => {
      console.error(err);
      return err;
    });
}

export async function removeTempImage(file) {
  await ensureFile(file)
    .then(async () => {
      await remove(file, err => {
        if (err) return console.error(err);
      });
    })
    .catch(err => console.error(err));
}

export async function moveImage(oldDir, newDir, filename) {
  try {
    await ensureDir(newDir, err => {
      if (err) console.error(err);
    });
    await move(oldDir + '/' + filename, newDir + '/' + filename);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

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
