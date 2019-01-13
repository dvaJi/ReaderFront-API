import path from 'path';

/**
 * Generate a path of a chapter, if filename is undefined it will return only the directory
 * @param {*} chapter
 * @param {*} work
 * @param {*} filename Optional
 */
export function generateChapterDir(chapter, work, filename) {
  const workDir = work.stub + '_' + work.uniqid;
  const chapDir = chapter.stub + '_' + chapter.uniqid;

  // If filename is undefined, just return directory
  if (filename === undefined) {
    return path.join(
      __dirname,
      '..',
      '..',
      'public',
      'works',
      workDir,
      chapDir
    );
  } else {
    return path.join(
      __dirname,
      '..',
      '..',
      'public',
      'works',
      workDir,
      chapDir,
      filename
    );
  }
}

const illegalRe = /[\/\?<>\\:\*\|":]/g; //eslint-disable-line no-useless-escape
const controlRe = /[\x00-\x1f\x80-\x9f]/g; //eslint-disable-line no-control-regex
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[\. ]+$/; //eslint-disable-line no-useless-escape
const removeWhiteSpace = /\s/g;
const removeSpecialCharacters = /[[|\]|(|)|'|"|$]/g;

export const sanitizeFilename = (filename, replacement = '') =>
  filename
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement)
    .replace(removeSpecialCharacters, replacement)
    .replace(removeWhiteSpace, '_');

/**
 * Same functionality as forEach, but runs only one callback at a time.
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with undefined value.
 */
export async function forEachSeries(array, callback, thisArg) {
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      await callback.call(thisArg || this, await array[i], i, array);
    }
  }
}

/**
 * Get extension from a file
 * @param {*} filename
 */
export function getFileExtension(filename) {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
}
