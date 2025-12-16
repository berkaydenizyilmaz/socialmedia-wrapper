/**
 * File reading utilities for browser-based folder upload
 */

/**
 * Convert FileList to a map of path -> File for easy access
 * @param {FileList} fileList - Files from input element with webkitdirectory
 * @returns {Object} Map of relative paths to File objects
 */
export function readDirectory(fileList) {
  const files = {};
  for (const file of fileList) {
    // webkitRelativePath gives us the full path from the selected folder
    files[file.webkitRelativePath] = file;
  }
  return files;
}

/**
 * Read a File as JSON
 * @param {File} file - File object to read
 * @returns {Promise<Object>} Parsed JSON content
 */
export async function readFileAsJSON(file) {
  const text = await file.text();
  return JSON.parse(text);
}

/**
 * Read a Twitter .js file (window.YTD.*.part0 = [...] format)
 * @param {File} file - Twitter JS file
 * @returns {Promise<Array>} Parsed array content
 */
export async function readTwitterJsFile(file) {
  const text = await file.text();
  // Remove "window.YTD.*.part0 = " prefix to get pure JSON
  const jsonStr = text.replace(/^window\.YTD\.\w+\.part\d+\s*=\s*/, '');
  return JSON.parse(jsonStr);
}

/**
 * Find a file by partial path match
 * @param {Object} files - File map from readDirectory
 * @param {string} partialPath - Partial path to search for
 * @returns {File|null} Matching file or null
 */
export function findFileByPath(files, partialPath) {
  const paths = Object.keys(files);
  // Match exact filename or path ending with /filename
  const match = paths.find((p) => {
    const filename = p.split('/').pop();
    return filename === partialPath || p.endsWith('/' + partialPath);
  });
  return match ? files[match] : null;
}

/**
 * Find all files matching a partial path
 * @param {Object} files - File map from readDirectory
 * @param {string} partialPath - Partial path to search for
 * @returns {File[]} Array of matching files
 */
export function findAllFilesByPath(files, partialPath) {
  return Object.entries(files)
    .filter(([path]) => path.includes(partialPath))
    .map(([, file]) => file);
}

/**
 * Detect platform type from folder structure
 * @param {Object} files - File map from readDirectory
 * @returns {'instagram'|'twitter'|null} Detected platform or null
 */
export function detectPlatform(files) {
  const paths = Object.keys(files);

  // Instagram markers
  if (paths.some((p) => p.includes("your_instagram_activity"))) {
    return "instagram";
  }

  // Twitter markers (data files are .js files)
  if (paths.some((p) => p.includes("tweets.js") || p.includes("like.js"))) {
    return "twitter";
  }

  return null;
}

/**
 * Get basic stats about the uploaded folder
 * @param {Object} files - File map from readDirectory
 * @returns {Object} Stats object
 */
export function getFolderStats(files) {
  const paths = Object.keys(files);
  const jsonFiles = paths.filter((p) => p.endsWith(".json"));
  const jsFiles = paths.filter((p) => p.endsWith(".js"));

  let totalSize = 0;
  for (const file of Object.values(files)) {
    totalSize += file.size;
  }

  return {
    totalFiles: paths.length,
    jsonFiles: jsonFiles.length,
    jsFiles: jsFiles.length,
    totalSizeBytes: totalSize,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
  };
}
