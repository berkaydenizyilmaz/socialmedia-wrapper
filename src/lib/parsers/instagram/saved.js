/**
 * Parse Instagram saved posts
 */

/**
 * Parse saved posts
 * @param {Object} data - Parsed saved_posts.json content
 * @returns {Object} Processed saved data
 */
export function parseSavedPosts(data) {
  const saved = (data?.saved_saved_media || []).map(item => {
    const savedOn = item.string_map_data?.["Saved on"] || item.string_map_data?.["Kaydedilme tarihi"];
    return {
      account: item.title,
      url: savedOn?.href,
      timestamp: savedOn?.timestamp,
      date: savedOn?.timestamp ? new Date(savedOn.timestamp * 1000) : null
    };
  }).filter(s => s.account);

  // Top accounts by saves
  const accountCounts = {};
  saved.forEach(s => {
    accountCounts[s.account] = (accountCounts[s.account] || 0) + 1;
  });
  const topAccounts = Object.entries(accountCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([account, count]) => ({ account, count }));

  // Content type detection (reel vs post)
  let reelCount = 0;
  let postCount = 0;
  saved.forEach(s => {
    if (s.url?.includes('/reel/')) {
      reelCount++;
    } else if (s.url?.includes('/p/')) {
      postCount++;
    }
  });

  // Recent saves
  const recentSaves = saved
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 10);

  return {
    total: saved.length,
    topAccounts,
    contentTypes: {
      reels: reelCount,
      posts: postCount
    },
    recentSaves
  };
}
