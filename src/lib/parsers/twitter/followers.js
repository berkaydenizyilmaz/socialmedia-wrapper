/**
 * Parse Twitter followers and following data
 * @param {Array} followersData - Parsed follower.js content
 * @param {Array} followingData - Parsed following.js content
 * @returns {Object} Processed followers/following data
 */
export function parseFollowers(followersData, followingData) {
  const followers = (followersData || []).map(item => ({
    accountId: item.follower?.accountId || null,
    userLink: item.follower?.userLink || null
  }));

  const following = (followingData || []).map(item => ({
    accountId: item.following?.accountId || null,
    userLink: item.following?.userLink || null
  }));

  // Create sets for comparison by accountId
  const followerIds = new Set(followers.map(f => f.accountId));
  const followingIds = new Set(following.map(f => f.accountId));

  // Calculate relationships
  const mutuals = following.filter(f => followerIds.has(f.accountId));
  const notFollowingBack = following.filter(f => !followerIds.has(f.accountId));
  const youDontFollow = followers.filter(f => !followingIds.has(f.accountId));

  return {
    followers,
    following,
    mutuals,
    notFollowingBack,
    youDontFollow,
    stats: {
      followersCount: followers.length,
      followingCount: following.length,
      mutualsCount: mutuals.length,
      notFollowingBackCount: notFollowingBack.length,
      youDontFollowCount: youDontFollow.length,
      ratio: followers.length > 0 
        ? (following.length / followers.length).toFixed(2) 
        : 0
    }
  };
}
