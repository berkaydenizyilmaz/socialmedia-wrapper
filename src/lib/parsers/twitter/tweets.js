/**
 * Parse Twitter tweets data for comprehensive analytics
 * @param {Array} data - Parsed tweets.js content
 * @returns {Object} Processed tweets data with analytics
 */
export function parseTweets(data) {
  const tweets = (data || []).map(item => {
    const tweet = item.tweet || {};
    
    // Extract source (Android, iOS, Web, etc)
    const sourceMatch = tweet.source?.match(/>([^<]+)</);
    const source = sourceMatch ? sourceMatch[1] : 'Unknown';
    
    // Parse created_at date
    const createdAt = tweet.created_at ? new Date(tweet.created_at) : null;
    
    return {
      id: tweet.id_str,
      text: tweet.full_text,
      source,
      createdAt,
      favoriteCount: parseInt(tweet.favorite_count || 0),
      retweetCount: parseInt(tweet.retweet_count || 0),
      lang: tweet.lang,
      isReply: !!tweet.in_reply_to_status_id,
      isRetweet: tweet.full_text?.startsWith('RT @'),
      hashtags: (tweet.entities?.hashtags || []).map(h => h.text),
      mentions: (tweet.entities?.user_mentions || []).map(m => ({
        username: m.screen_name,
        name: m.name
      }))
    };
  });

  // Calculate analytics
  const analytics = calculateTweetAnalytics(tweets);

  return {
    total: tweets.length,
    tweets,
    ...analytics
  };
}

function calculateTweetAnalytics(tweets) {
  // Source distribution
  const sourceCounts = {};
  tweets.forEach(t => {
    sourceCounts[t.source] = (sourceCounts[t.source] || 0) + 1;
  });
  const sourceDistribution = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, percentage: ((count / tweets.length) * 100).toFixed(1) }));

  // Hashtag frequency
  const hashtagCounts = {};
  tweets.forEach(t => {
    t.hashtags.forEach(tag => {
      hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
    });
  });
  const topHashtags = Object.entries(hashtagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([tag, count]) => ({ tag, count }));

  // Mention frequency
  const mentionCounts = {};
  tweets.forEach(t => {
    t.mentions.forEach(m => {
      mentionCounts[m.username] = (mentionCounts[m.username] || 0) + 1;
    });
  });
  const topMentions = Object.entries(mentionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([username, count]) => ({ username, count }));

  // Language distribution
  const langCounts = {};
  tweets.forEach(t => {
    if (t.lang) {
      langCounts[t.lang] = (langCounts[t.lang] || 0) + 1;
    }
  });
  const languageDistribution = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, count]) => ({ lang, count }));

  // Timeline (by month)
  const timeline = {};
  tweets.forEach(t => {
    if (t.createdAt) {
      const monthKey = t.createdAt.toISOString().slice(0, 7); // YYYY-MM
      timeline[monthKey] = (timeline[monthKey] || 0) + 1;
    }
  });
  const tweetTimeline = Object.entries(timeline)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  // Tweet type breakdown
  const originalTweets = tweets.filter(t => !t.isReply && !t.isRetweet).length;
  const replies = tweets.filter(t => t.isReply).length;
  const retweets = tweets.filter(t => t.isRetweet).length;

  // Top tweets by engagement
  const topTweets = tweets
    .filter(t => !t.isRetweet)
    .sort((a, b) => (b.favoriteCount + b.retweetCount) - (a.favoriteCount + a.retweetCount))
    .slice(0, 10)
    .map(t => ({
      id: t.id,
      text: t.text,
      favoriteCount: t.favoriteCount,
      retweetCount: t.retweetCount,
      date: t.createdAt?.toISOString().split('T')[0]
    }));

  // Engagement stats
  const totalFavorites = tweets.reduce((sum, t) => sum + t.favoriteCount, 0);
  const totalRetweets = tweets.reduce((sum, t) => sum + t.retweetCount, 0);
  const avgFavorites = tweets.length > 0 ? (totalFavorites / tweets.length).toFixed(1) : 0;
  const avgRetweets = tweets.length > 0 ? (totalRetweets / tweets.length).toFixed(1) : 0;

  return {
    sourceDistribution,
    topHashtags,
    topMentions,
    languageDistribution,
    tweetTimeline,
    tweetTypes: {
      original: originalTweets,
      replies,
      retweets
    },
    topTweets,
    engagement: {
      totalFavorites,
      totalRetweets,
      avgFavorites,
      avgRetweets
    }
  };
}
