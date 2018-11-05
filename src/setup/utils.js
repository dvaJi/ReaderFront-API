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
