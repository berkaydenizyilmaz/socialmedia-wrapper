/**
 * Main Twitter data parser
 * Orchestrates all individual parsers
 */

import { findFileByPath, readTwitterJsFile } from "@/lib/file-reader";
import { parseLikes } from "./likes";
import { parseFollowers } from "./followers";

// Known file paths in Twitter data export
const FILE_PATHS = {
  likes: "like.js",
  followers: "follower.js",
  following: "following.js",
  tweets: "tweets.js",
  block: "block.js",
};

/**
 * Parse all Twitter data from uploaded files
 * @param {Object} files - File map from readDirectory
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<Object>} Parsed Twitter data
 */
export async function parseTwitterData(files, onProgress) {
  const errors = [];
  const result = {
    likes: null,
    followers: null,
    metadata: {
      parsedAt: new Date().toISOString(),
      fileCount: Object.keys(files).length,
      errors: []
    }
  };

  const progressStep = 100 / 4;
  let currentProgress = 0;

  // Helper function to safely parse a Twitter JS file
  const safeParseFile = async (path, parser, ...extraArgs) => {
    try {
      const file = findFileByPath(files, path);
      if (!file) {
        return null;
      }
      const data = await readTwitterJsFile(file);
      return parser(data, ...extraArgs);
    } catch (err) {
      errors.push({ path, error: err.message });
      return null;
    }
  };

  // Parse likes
  result.likes = await safeParseFile(FILE_PATHS.likes, parseLikes);
  currentProgress += progressStep;
  onProgress?.(Math.round(currentProgress));

  // Parse followers and following together
  const followersFile = findFileByPath(files, FILE_PATHS.followers);
  const followingFile = findFileByPath(files, FILE_PATHS.following);
  
  try {
    const followersData = followersFile ? await readTwitterJsFile(followersFile) : null;
    const followingData = followingFile ? await readTwitterJsFile(followingFile) : null;
    result.followers = parseFollowers(followersData, followingData);
  } catch (err) {
    errors.push({ path: "followers/following", error: err.message });
  }
  currentProgress += progressStep * 2;
  onProgress?.(Math.round(currentProgress));

  // Finalize
  result.metadata.errors = errors;
  onProgress?.(100);

  return result;
}

/**
 * Get summary stats from parsed Twitter data
 * @param {Object} data - Parsed Twitter data
 * @returns {Object} Summary statistics
 */
export function getTwitterSummary(data) {
  return {
    totalLikes: data.likes?.total || 0,
    followersCount: data.followers?.stats?.followersCount || 0,
    followingCount: data.followers?.stats?.followingCount || 0,
    mutualsCount: data.followers?.stats?.mutualsCount || 0,
    notFollowingBackCount: data.followers?.stats?.notFollowingBackCount || 0,
    recentLikes: data.likes?.recentLikes?.slice(0, 10) || []
  };
}
