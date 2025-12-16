/**
 * Activity pattern analysis
 */

/**
 * Analyze activity patterns from likes and comments
 * @param {Array} likes - Parsed likes data
 * @param {Array} comments - Parsed comments data  
 * @returns {Object} Activity pattern analysis
 */
export function analyzeActivityPatterns(likes = [], comments = []) {
  // Combine all timestamps
  const allActivities = [
    ...likes.map(l => l.timestamp).filter(Boolean),
    ...comments.map(c => c.timestamp).filter(Boolean)
  ];

  if (allActivities.length === 0) {
    return null;
  }

  // Time period categories
  const periods = {
    earlyBird: { name: "Sabahçı", emoji: "🌅", range: "06:00-12:00", count: 0 },
    afternoon: { name: "Öğlenci", emoji: "☀️", range: "12:00-18:00", count: 0 },
    evening: { name: "Akşamcı", emoji: "🌆", range: "18:00-24:00", count: 0 },
    nightOwl: { name: "Gece Kuşu", emoji: "🦉", range: "00:00-06:00", count: 0 }
  };

  // Hourly distribution
  const hourCounts = Array(24).fill(0);

  // Categorize each activity
  allActivities.forEach(ts => {
    const date = new Date(ts * 1000);
    const hour = date.getHours();
    
    hourCounts[hour]++;

    if (hour >= 6 && hour < 12) {
      periods.earlyBird.count++;
    } else if (hour >= 12 && hour < 18) {
      periods.afternoon.count++;
    } else if (hour >= 18 && hour < 24) {
      periods.evening.count++;
    } else {
      periods.nightOwl.count++;
    }
  });

  const total = allActivities.length;

  // Calculate percentages
  Object.values(periods).forEach(period => {
    period.percentage = Math.round((period.count / total) * 100);
  });

  // Determine dominant type
  const sorted = Object.entries(periods).sort((a, b) => b[1].count - a[1].count);
  const dominant = sorted[0][1];
  const secondary = sorted[1][1];

  // Day of week analysis
  const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const dayCounts = Array(7).fill(0);
  
  allActivities.forEach(ts => {
    const date = new Date(ts * 1000);
    dayCounts[date.getDay()]++;
  });

  const weekdayCount = dayCounts.slice(1, 6).reduce((a, b) => a + b, 0);
  const weekendCount = dayCounts[0] + dayCounts[6];
  const weekdayPercentage = Math.round((weekdayCount / total) * 100);
  const weekendPercentage = Math.round((weekendCount / total) * 100);

  // Most active day
  const maxDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
  const mostActiveDay = dayNames[maxDayIndex];

  // Most active hour
  const maxHourIndex = hourCounts.indexOf(Math.max(...hourCounts));

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
    hourlyDistribution: hourCounts.map((count, hour) => ({ hour, count })),
    weekdayVsWeekend: {
      weekday: weekdayPercentage,
      weekend: weekendPercentage
    },
    mostActiveDay,
    mostActiveHour: maxHourIndex
  };
}
