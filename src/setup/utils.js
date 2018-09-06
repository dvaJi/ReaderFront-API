import path from 'path';

/**
 * Generate a path of a chapter
 * @param {*} chapter
 * @param {*} work
 * @param {*} filename Optional
 */
export function generateChapterDir(chapter, work, filename) {
  const workDir = work.stub + '_' + work.uniqid;
  const chapDir =
    chapter.chapter +
    '-' +
    chapter.subchapter +
    '_' +
    chapter.stub +
    '_' +
    chapter.uniqid;

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
