/**
 * Parse Instagram comments data
 * @param {Array} json - Parsed post_comments_1.json content
 * @returns {Object} Processed comments data
 */
export function parseComments(json) {
  const items = json || [];
  
  const comments = items.map(item => {
    const stringMapData = item.string_map_data || {};
    
    return {
      text: stringMapData.Comment?.value || null,
      mediaOwner: stringMapData['Media Owner']?.value || 'unknown',
      timestamp: stringMapData.Time?.timestamp || null,
      date: stringMapData.Time?.timestamp
        ? new Date(stringMapData.Time.timestamp * 1000)
        : null,
      hasGif: !!(item.media_list_data?.[0]?.uri),
      gifUrl: item.media_list_data?.[0]?.uri || null
    };
  });

  // Count comments per account
  const accountCounts = {};
  comments.forEach(comment => {
    if (comment.mediaOwner) {
      accountCounts[comment.mediaOwner] = (accountCounts[comment.mediaOwner] || 0) + 1;
    }
  });

  // Top commented accounts
  const topCommentedAccounts = Object.entries(accountCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([username, count]) => ({ username, count }));

  // Group by date for timeline
  const timeline = {};
  comments.forEach(comment => {
    if (comment.date) {
      const dateKey = comment.date.toISOString().split('T')[0];
      timeline[dateKey] = (timeline[dateKey] || 0) + 1;
    }
  });

  const sortedTimeline = Object.entries(timeline)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  // Stats
  const textComments = comments.filter(c => c.text);
  const gifComments = comments.filter(c => c.hasGif);

  return {
    total: comments.length,
    comments,
    topCommentedAccounts,
    timeline: sortedTimeline,
    stats: {
      textComments: textComments.length,
      gifComments: gifComments.length
    }
  };
}

/**
 * Parse Instagram reels comments data
 * @param {Array} json - Parsed reels_comments.json content
 * @returns {Object} Processed reels comments data
 */
export function parseReelsComments(json) {
  // Same structure as post comments
  return parseComments(json);
}
