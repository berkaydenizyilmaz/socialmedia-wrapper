/**
 * Parse Twitter personalization data for interest analysis
 * @param {Array} data - Parsed personalization.js content
 * @returns {Object} Processed interests data
 */
export function parseInterests(data) {
  const p13nData = data?.[0]?.p13nData;
  
  if (!p13nData) {
    return {
      interests: [],
      categories: {},
      demographics: null
    };
  }

  // Extract interests
  const interests = (p13nData.interests?.interests || [])
    .filter(i => !i.isDisabled)
    .map(i => i.name);

  // Categorize interests (basic categorization)
  const categories = categorizeInterests(interests);

  // Demographics
  const demographics = {
    languages: p13nData.demographics?.languages?.map(l => l.language) || [],
    gender: p13nData.demographics?.genderInfo?.gender || 'unknown'
  };

  return {
    interests,
    totalCount: interests.length,
    categories,
    demographics
  };
}

function categorizeInterests(interests) {
  const categories = {
    'Spor': [],
    'Teknoloji': [],
    'Eğlence': [],
    'Müzik': [],
    'Oyun': [],
    'İş & Finans': [],
    'Politika & Haber': [],
    'Yaşam': [],
    'Diğer': []
  };

  const categoryKeywords = {
    'Spor': ['football', 'soccer', 'basketball', 'sports', 'spor', 'league', 'team', 'player', 'fc', 'sk', 'nba', 'uefa', 'fifa'],
    'Teknoloji': ['tech', 'programming', 'software', 'ai', 'google', 'apple', 'android', 'ios', 'computer', 'cyber', 'digital', 'startup'],
    'Eğlence': ['movie', 'film', 'tv', 'series', 'netflix', 'entertainment', 'actor', 'celebrity', 'dizi'],
    'Müzik': ['music', 'song', 'artist', 'singer', 'band', 'concert', 'pop', 'rock', 'hip-hop', 'müzik'],
    'Oyun': ['gaming', 'game', 'esports', 'playstation', 'xbox', 'nintendo', 'steam', 'twitch'],
    'İş & Finans': ['business', 'finance', 'crypto', 'trading', 'investment', 'economy', 'stock', 'forex'],
    'Politika & Haber': ['politic', 'news', 'government', 'election', 'crisis', 'war']
  };

  interests.forEach(interest => {
    const lowerInterest = interest.toLowerCase();
    let categorized = false;

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(kw => lowerInterest.includes(kw))) {
        categories[category].push(interest);
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      categories['Diğer'].push(interest);
    }
  });

  // Remove empty categories
  return Object.fromEntries(
    Object.entries(categories).filter(([, items]) => items.length > 0)
  );
}

/**
 * Parse account data
 * @param {Array} data - Parsed account.js content
 * @returns {Object} Account info
 */
export function parseAccount(data) {
  const account = data?.[0]?.account;
  
  if (!account) return null;

  const createdAt = account.createdAt ? new Date(account.createdAt) : null;
  const now = new Date();
  
  let accountAge = null;
  if (createdAt) {
    const years = now.getFullYear() - createdAt.getFullYear();
    const months = now.getMonth() - createdAt.getMonth();
    const days = now.getDate() - createdAt.getDate();
    
    accountAge = {
      years,
      months: months < 0 ? 12 + months : months,
      days: days < 0 ? 30 + days : days,
      totalDays: Math.floor((now - createdAt) / (1000 * 60 * 60 * 24))
    };
  }

  return {
    username: account.username,
    displayName: account.accountDisplayName,
    accountId: account.accountId,
    createdAt,
    accountAge
  };
}

/**
 * Parse block list
 * @param {Array} data - Parsed block.js content
 * @returns {Object} Block info
 */
export function parseBlocks(data) {
  const blocks = (data || []).map(item => ({
    accountId: item.blocking?.accountId,
    userLink: item.blocking?.userLink
  }));

  return {
    total: blocks.length,
    blocks
  };
}
