/**
 * Parse Instagram likes data
 * @param {Object} json - Parsed liked_posts.json content
 * @returns {Object} Processed likes data
 */
export function parseLikes(json) {
  const items = json?.likes_media_likes || [];
  
  const likes = items.map(item => ({
    username: item.title || 'unknown',
    href: item.string_list_data?.[0]?.href || null,
    timestamp: item.string_list_data?.[0]?.timestamp || null,
    date: item.string_list_data?.[0]?.timestamp 
      ? new Date(item.string_list_data[0].timestamp * 1000)
      : null
  }));

  // Count likes per account
  const accountCounts = {};
  likes.forEach(like => {
    if (like.username) {
      accountCounts[like.username] = (accountCounts[like.username] || 0) + 1;
    }
  });
  
  // Top accounts by like count
  const topAccounts = Object.entries(accountCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([username, count]) => ({ username, count }));

  // Group by date for timeline
  const timeline = {};
  likes.forEach(like => {
    if (like.date) {
      const dateKey = like.date.toISOString().split('T')[0];
      timeline[dateKey] = (timeline[dateKey] || 0) + 1;
    }
  });

  // Sort timeline by date
  const sortedTimeline = Object.entries(timeline)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  return {
    total: likes.length,
    likes,
    topAccounts,
    timeline: sortedTimeline
  };
}

/**
 * Parse liked comments data
 * @param {Object} json - Parsed liked_comments.json content
 * @returns {Object} Processed liked comments data
 */
export function parseLikedComments(json) {
  const items = json?.likes_comment_likes || [];
  
  const likedComments = items.map(item => ({
    username: item.title || 'unknown',
    href: item.string_list_data?.[0]?.href || null,
    timestamp: item.string_list_data?.[0]?.timestamp || null
  }));

  return {
    total: likedComments.length,
    likedComments
  };
}
