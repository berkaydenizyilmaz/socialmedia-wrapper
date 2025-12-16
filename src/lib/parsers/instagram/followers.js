/**
 * Parse Instagram followers and following data
 * @param {Array} followersJson - Parsed followers_1.json content (array format)
 * @param {Object} followingJson - Parsed following.json content (object format)
 * @returns {Object} Processed followers/following data with analysis
 */
export function parseFollowers(followersJson, followingJson) {
  // Followers: Array format - username is in string_list_data[0].value
  const followers = (followersJson || []).map(item => ({
    username: item.string_list_data?.[0]?.value || 'unknown',
    href: item.string_list_data?.[0]?.href || null,
    timestamp: item.string_list_data?.[0]?.timestamp || null,
    date: item.string_list_data?.[0]?.timestamp
      ? new Date(item.string_list_data[0].timestamp * 1000)
      : null
  }));

  // Following: Object format with relationships_following key
  // Username is in title field
  const followingArray = followingJson?.relationships_following || [];
  const following = followingArray.map(item => ({
    username: item.title || 'unknown',
    href: item.string_list_data?.[0]?.href || null,
    timestamp: item.string_list_data?.[0]?.timestamp || null,
    date: item.string_list_data?.[0]?.timestamp
      ? new Date(item.string_list_data[0].timestamp * 1000)
      : null
  }));

  // Create sets for comparison
  const followerUsernames = new Set(followers.map(f => f.username.toLowerCase()));
  const followingUsernames = new Set(following.map(f => f.username.toLowerCase()));

  // Calculate relationships
  const mutuals = following.filter(f => 
    followerUsernames.has(f.username.toLowerCase())
  );
  
  const notFollowingBack = following.filter(f => 
    !followerUsernames.has(f.username.toLowerCase())
  );
  
  const youDontFollow = followers.filter(f => 
    !followingUsernames.has(f.username.toLowerCase())
  );

  // Recent followers (last 30 days)
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const recentFollowers = followers.filter(f => 
    f.date && f.date.getTime() > thirtyDaysAgo
  );

  return {
    followers,
    following,
    mutuals,
    notFollowingBack,
    youDontFollow,
    recentFollowers,
    stats: {
      followersCount: followers.length,
      followingCount: following.length,
      mutualsCount: mutuals.length,
      notFollowingBackCount: notFollowingBack.length,
      youDontFollowCount: youDontFollow.length,
      recentFollowersCount: recentFollowers.length,
      ratio: followers.length > 0 
        ? (following.length / followers.length).toFixed(2) 
        : 0
    }
  };
}
