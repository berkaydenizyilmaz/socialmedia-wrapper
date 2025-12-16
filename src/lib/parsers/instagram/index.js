/**
 * Main Instagram data parser
 * Orchestrates all individual parsers
 */

import { findFileByPath, readFileAsJSON } from "@/lib/file-reader";
import { parseLikes, parseLikedComments } from "./likes";
import { parseFollowers } from "./followers";
import { parseComments, parseReelsComments } from "./comments";
import { parseLoginActivity } from "./security";
import { parseTopics } from "./topics";
import { parseSavedPosts } from "./saved";

// Known file paths in Instagram data export
const FILE_PATHS = {
  likedPosts: "your_instagram_activity/likes/liked_posts.json",
  likedComments: "your_instagram_activity/likes/liked_comments.json",
  followers: "connections/followers_and_following/followers_1.json",
  following: "connections/followers_and_following/following.json",
  postComments: "your_instagram_activity/comments/post_comments_1.json",
  reelsComments: "your_instagram_activity/comments/reels_comments.json",
  loginActivity: "security_and_login_information/login_and_profile_creation/login_activity.json",
  topics: "preferences/your_topics/recommended_topics.json",
  savedPosts: "your_instagram_activity/saved/saved_posts.json",
};

/**
 * Parse all Instagram data from uploaded files
 * @param {Object} files - File map from readDirectory
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<Object>} Parsed Instagram data
 */
export async function parseInstagramData(files, onProgress) {
  const errors = [];
  const result = {
    likes: null,
    likedComments: null,
    followers: null,
    comments: null,
    reelsComments: null,
    loginActivity: null,
    topics: null,
    savedPosts: null,
    metadata: {
      parsedAt: new Date().toISOString(),
      fileCount: Object.keys(files).length,
      errors: []
    }
  };

  const totalSteps = 9;
  let currentStep = 0;

  // Helper function to safely parse a file
  const safeParseFile = async (path, parser, ...extraArgs) => {
    try {
      const file = findFileByPath(files, path);
      if (!file) {
        return null;
      }
      const json = await readFileAsJSON(file);
      return parser(json, ...extraArgs);
    } catch (err) {
      errors.push({ path, error: err.message });
      return null;
    }
  };

  // Parse liked posts
  result.likes = await safeParseFile(FILE_PATHS.likedPosts, parseLikes);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse liked comments
  result.likedComments = await safeParseFile(FILE_PATHS.likedComments, parseLikedComments);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse followers and following together
  const followersFile = findFileByPath(files, FILE_PATHS.followers);
  const followingFile = findFileByPath(files, FILE_PATHS.following);
  
  try {
    const followersJson = followersFile ? await readFileAsJSON(followersFile) : null;
    const followingJson = followingFile ? await readFileAsJSON(followingFile) : null;
    result.followers = parseFollowers(followersJson, followingJson);
  } catch (err) {
    errors.push({ path: "followers/following", error: err.message });
  }
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse post comments
  result.comments = await safeParseFile(FILE_PATHS.postComments, parseComments);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse reels comments
  result.reelsComments = await safeParseFile(FILE_PATHS.reelsComments, parseReelsComments);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse login activity
  result.loginActivity = await safeParseFile(FILE_PATHS.loginActivity, parseLoginActivity);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse topics
  result.topics = await safeParseFile(FILE_PATHS.topics, parseTopics);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse saved posts
  result.savedPosts = await safeParseFile(FILE_PATHS.savedPosts, parseSavedPosts);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Finalize
  result.metadata.errors = errors;
  onProgress?.(100);

  return result;
}

/**
 * Get summary stats from parsed Instagram data
 * @param {Object} data - Parsed Instagram data
 * @returns {Object} Summary statistics
 */
export function getInstagramSummary(data) {
  return {
    totalLikes: data.likes?.total || 0,
    totalComments: (data.comments?.total || 0) + (data.reelsComments?.total || 0),
    followersCount: data.followers?.stats?.followersCount || 0,
    followingCount: data.followers?.stats?.followingCount || 0,
    mutualsCount: data.followers?.stats?.mutualsCount || 0,
    notFollowingBackCount: data.followers?.stats?.notFollowingBackCount || 0,
    topLikedAccounts: data.likes?.topAccounts?.slice(0, 5) || [],
    topCommentedAccounts: data.comments?.topCommentedAccounts?.slice(0, 5) || [],
    
    // New stats
    topicsCount: data.topics?.total || 0,
    savedPostsCount: data.savedPosts?.total || 0,
    loginCount: data.loginActivity?.total || 0,
    uniqueLoginIps: data.loginActivity?.uniqueIps || 0
  };
}
