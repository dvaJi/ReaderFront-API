import path from 'path';
import { ensureDir, ensureFile, move, remove } from 'fs-extra';

/**
 * Delete a image
 *
 * @param {*} file
 */
export async function deleteImage(file) {
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
