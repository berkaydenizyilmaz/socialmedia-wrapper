/**
 * Parse Instagram story interactions
 */

/**
 * Parse story likes
 * @param {Object} data - Parsed story_likes.json content
 * @returns {Object} Processed story likes data
 */
export function parseStoryLikes(data) {
  const items = data?.story_activities_story_likes || [];
  
  const likes = items.map(item => ({
    username: item.title,
    timestamp: item.string_list_data?.[0]?.timestamp,
    date: item.string_list_data?.[0]?.timestamp 
      ? new Date(item.string_list_data[0].timestamp * 1000)
      : null
  })).filter(l => l.username);

  // Count per account
  const accountCounts = {};
  likes.forEach(l => {
    accountCounts[l.username] = (accountCounts[l.username] || 0) + 1;
  });

  const topAccounts = Object.entries(accountCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([username, count]) => ({ username, count }));

  return {
    total: likes.length,
    topAccounts,
    uniqueAccounts: Object.keys(accountCounts).length
  };
}

/**
 * Parse close friends list
 * @param {Object} data - Parsed close_friends.json content
 * @returns {Object} Processed close friends data
 */
export function parseCloseFriends(data) {
  const items = data?.relationships_close_friends || [];
  
  const friends = items.map(item => ({
    username: item.string_list_data?.[0]?.value,
    href: item.string_list_data?.[0]?.href,
    addedAt: item.string_list_data?.[0]?.timestamp
      ? new Date(item.string_list_data[0].timestamp * 1000)
      : null
  })).filter(f => f.username);

  return {
    total: friends.length,
    friends
  };
}

/**
 * Parse recently unfollowed profiles
 * @param {Object} data - Parsed recently_unfollowed_profiles.json content
 * @returns {Object} Processed unfollowed data
 */
export function parseUnfollowed(data) {
  const items = data?.relationships_unfollowed_users || [];
  
  const unfollowed = items.map(item => ({
    username: item.string_list_data?.[0]?.value,
    href: item.string_list_data?.[0]?.href,
    unfollowedAt: item.string_list_data?.[0]?.timestamp
      ? new Date(item.string_list_data[0].timestamp * 1000)
      : null
  })).filter(u => u.username);

  return {
    total: unfollowed.length,
    profiles: unfollowed
  };
}

/**
 * Parse search history
 * @param {Object} data - Parsed word_or_phrase_searches.json content
 * @returns {Object} Processed search data
 */
export function parseSearches(data) {
  const items = data?.searches_keyword || [];
  
  const searches = items.map(item => {
    const searchValue = item.string_map_data?.["Arama"]?.value || 
                        item.string_map_data?.["Search"]?.value;
    const timestamp = item.string_map_data?.["Tarih"]?.timestamp ||
                      item.string_map_data?.["Date"]?.timestamp;
    return {
      query: searchValue,
      timestamp,
      date: timestamp ? new Date(timestamp * 1000) : null
    };
  }).filter(s => s.query);

  // Count search frequency
  const searchCounts = {};
  searches.forEach(s => {
    searchCounts[s.query] = (searchCounts[s.query] || 0) + 1;
  });

  const topSearches = Object.entries(searchCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([query, count]) => ({ query, count }));

  // Extract words from all searches and count them
  const wordCounts = {};
  searches.forEach(s => {
    const words = s.query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  });

  const topWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  return {
    total: searches.length,
    topSearches,
    topWords,
    recentSearches: searches.slice(0, 10)
  };
}
