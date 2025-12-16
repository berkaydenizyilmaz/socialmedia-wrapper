/**
 * Main Twitter data parser
 * Orchestrates all individual parsers
 */

import { findFileByPath, readTwitterJsFile } from "@/lib/file-reader";
import { parseLikes } from "./likes";
import { parseFollowers } from "./followers";
import { parseTweets } from "./tweets";
import { parseInterests, parseAccount, parseBlocks } from "./interests";
import { parseScreenNameChanges, parseMutes, parseDirectMessages } from "./security";

// Known file paths in Twitter data export
const FILE_PATHS = {
  likes: "like.js",
  followers: "follower.js",
  following: "following.js",
  tweets: "tweets.js",
  personalization: "personalization.js",
  account: "account.js",
  block: "block.js",
  screenNameChange: "screen-name-change.js",
  mute: "mute.js",
  directMessages: "direct-messages.js",
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
    tweets: null,
    interests: null,
    account: null,
    blocks: null,
    screenNameChanges: null,
    mutes: null,
    directMessages: null,
    metadata: {
      parsedAt: new Date().toISOString(),
      fileCount: Object.keys(files).length,
      errors: []
    }
  };

  const totalSteps = 9;
  let currentStep = 0;

  // Helper function to safely parse a Twitter JS file
  const safeParseFile = async (path, parser) => {
    try {
      const file = findFileByPath(files, path);
      if (!file) {
        return null;
      }
      const data = await readTwitterJsFile(file);
      return parser(data);
    } catch (err) {
      errors.push({ path, error: err.message });
      return null;
    }
  };

  // Parse tweets
  result.tweets = await safeParseFile(FILE_PATHS.tweets, parseTweets);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse likes
  result.likes = await safeParseFile(FILE_PATHS.likes, parseLikes);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

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
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse interests/personalization
  result.interests = await safeParseFile(FILE_PATHS.personalization, parseInterests);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse account
  result.account = await safeParseFile(FILE_PATHS.account, parseAccount);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse blocks
  result.blocks = await safeParseFile(FILE_PATHS.block, parseBlocks);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse screen name changes
  result.screenNameChanges = await safeParseFile(FILE_PATHS.screenNameChange, parseScreenNameChanges);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse mutes
  result.mutes = await safeParseFile(FILE_PATHS.mute, parseMutes);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // Parse direct messages
  result.directMessages = await safeParseFile(FILE_PATHS.directMessages, parseDirectMessages);
  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

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
    // Tweets
    totalTweets: data.tweets?.total || 0,
    totalLikes: data.likes?.total || 0,
    
    // Followers
    followersCount: data.followers?.stats?.followersCount || 0,
    followingCount: data.followers?.stats?.followingCount || 0,
    mutualsCount: data.followers?.stats?.mutualsCount || 0,
    notFollowingBackCount: data.followers?.stats?.notFollowingBackCount || 0,
    
    // Tweet analytics
    tweetTypes: data.tweets?.tweetTypes || {},
    engagement: data.tweets?.engagement || {},
    topSource: data.tweets?.sourceDistribution?.[0]?.name || 'Bilinmiyor',
    activityPatterns: data.tweets?.activityPatterns || null,
    
    // Account
    username: data.account?.username || 'Unknown',
    accountAge: data.account?.accountAge || null,
    
    // Interests
    interestCount: data.interests?.totalCount || 0,
    
    // Blocks & Mutes
    blockedCount: data.blocks?.total || 0,
    mutedCount: data.mutes?.total || 0,
    
    // Username changes
    usernameChanges: data.screenNameChanges?.total || 0,
    
    // DMs
    dmConversations: data.directMessages?.totalConversations || 0,
    totalDmMessages: data.directMessages?.totalMessages || 0,
    dmTotals: data.directMessages?.totals || null,
    
    // Quick access
    topHashtags: data.tweets?.topHashtags?.slice(0, 5) || [],
    topMentions: data.tweets?.topMentions?.slice(0, 5) || [],
    recentLikes: data.likes?.recentLikes?.slice(0, 5) || []
  };
}
