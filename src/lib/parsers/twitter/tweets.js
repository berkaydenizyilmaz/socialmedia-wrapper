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
    let source = sourceMatch ? sourceMatch[1] : 'Bilinmiyor';
    // Simplify source names
    if (source.includes('Android')) source = 'Android';
    else if (source.includes('iPhone') || source.includes('iOS')) source = 'iPhone';
    else if (source.includes('Web')) source = 'Web';
    else if (source.includes('TweetDeck')) source = 'TweetDeck';
    
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

  // Activity patterns analysis (like Instagram)
  const activityPatterns = analyzeActivityPatterns(tweets);

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
    },
    activityPatterns
  };
}

/**
 * Analyze activity patterns from tweet timestamps
 */
function analyzeActivityPatterns(tweets) {
  const allTimestamps = tweets
    .map(t => t.createdAt)
    .filter(Boolean);

  if (allTimestamps.length === 0) return null;

  // Time period categories
  const periods = {
    earlyBird: { name: "Sabahçı", emoji: "🌅", range: "06:00-12:00", count: 0 },
    afternoon: { name: "Öğlenci", emoji: "☀️", range: "12:00-18:00", count: 0 },
    evening: { name: "Akşamcı", emoji: "🌆", range: "18:00-24:00", count: 0 },
    nightOwl: { name: "Gece Kuşu", emoji: "🦉", range: "00:00-06:00", count: 0 }
  };

  allTimestamps.forEach(date => {
    const hour = date.getHours();
    if (hour >= 6 && hour < 12) periods.earlyBird.count++;
    else if (hour >= 12 && hour < 18) periods.afternoon.count++;
    else if (hour >= 18 && hour < 24) periods.evening.count++;
    else periods.nightOwl.count++;
  });

  const total = allTimestamps.length;
  Object.values(periods).forEach(period => {
    period.percentage = Math.round((period.count / total) * 100);
  });

  const sorted = Object.entries(periods).sort((a, b) => b[1].count - a[1].count);
  const dominant = sorted[0][1];
  const secondary = sorted[1][1];

  // Day of week analysis
  const dayCounts = Array(7).fill(0);
  allTimestamps.forEach(date => {
    dayCounts[date.getDay()]++;
  });
  const weekdayCount = dayCounts.slice(1, 6).reduce((a, b) => a + b, 0);
  const weekendCount = dayCounts[0] + dayCounts[6];

  return {
    totalActivities: total,
    dominant: {
      type: dominant.name,
      emoji: dominant.emoji,
      percentage: dominant.percentage
    },
    secondary: {
      type: secondary.name,
      emoji: secondary.emoji,
      percentage: secondary.percentage
    },
    periods: Object.values(periods),
    weekdayVsWeekend: {
      weekday: Math.round((weekdayCount / total) * 100),
      weekend: Math.round((weekendCount / total) * 100)
    }
  };
}
