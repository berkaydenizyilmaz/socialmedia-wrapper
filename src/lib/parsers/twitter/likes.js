/**
 * Parse Twitter likes data
 * @param {Array} data - Parsed like.js content
 * @returns {Object} Processed likes data
 */
export function parseLikes(data) {
  const likes = (data || []).map(item => ({
    tweetId: item.like?.tweetId || null,
    fullText: item.like?.fullText || null,
    url: item.like?.expandedUrl || null
  }));

  return {
    total: likes.length,
    likes,
    // Twitter likes don't have usernames in the export, just tweet text
    recentLikes: likes.slice(0, 50)
  };
}
