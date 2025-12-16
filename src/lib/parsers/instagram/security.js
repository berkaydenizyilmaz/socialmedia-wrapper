/**
 * Parse Instagram security and login data
 */

/**
 * Parse login activity for security analysis
 * @param {Object} data - Parsed login_activity.json content
 * @returns {Object} Processed login data
 */
export function parseLoginActivity(data) {
  const logins = (data?.account_history_login_history || []).map(item => {
    const stringData = item.string_map_data || {};
    
    // Extract IP
    const ip = stringData["IP Adresi"]?.value || stringData["IP Address"]?.value;
    
    // Extract timestamp
    const timestamp = stringData["Zaman"]?.timestamp || stringData["Time"]?.timestamp;
    const date = timestamp ? new Date(timestamp * 1000) : null;
    
    // Extract user agent and parse device info
    const userAgent = stringData["Kullanıcı Aracısı"]?.value || stringData["User Agent"]?.value || "";
    const deviceInfo = parseUserAgent(userAgent);
    
    return {
      ip,
      date,
      userAgent,
      ...deviceInfo
    };
  }).filter(l => l.ip);

  // IP frequency
  const ipCounts = {};
  logins.forEach(l => {
    if (l.ip) {
      ipCounts[l.ip] = (ipCounts[l.ip] || 0) + 1;
    }
  });
  const topIps = Object.entries(ipCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([ip, count]) => ({ ip, count }));

  // Device distribution
  const deviceCounts = {};
  logins.forEach(l => {
    if (l.device) {
      deviceCounts[l.device] = (deviceCounts[l.device] || 0) + 1;
    }
  });
  const deviceDistribution = Object.entries(deviceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([device, count]) => ({ device, count, percentage: ((count / logins.length) * 100).toFixed(1) }));

  // Login times by hour
  const hourCounts = Array(24).fill(0);
  logins.forEach(l => {
    if (l.date) {
      const hour = l.date.getHours();
      hourCounts[hour]++;
    }
  });
  const loginsByHour = hourCounts.map((count, hour) => ({ hour, count }));

  return {
    total: logins.length,
    uniqueIps: Object.keys(ipCounts).length,
    topIps,
    deviceDistribution,
    loginsByHour
  };
}

function parseUserAgent(userAgent) {
  if (!userAgent) return { device: "Unknown", platform: "Unknown" };
  
  // Check for Instagram app
  if (userAgent.includes("Instagram")) {
    if (userAgent.includes("Android")) {
      // Extract device model from Android UA
      const match = userAgent.match(/; ([^;]+); ([^;]+);/);
      return { 
        device: "Android", 
        platform: "Instagram App",
        model: match ? match[2] : "Android"
      };
    } else if (userAgent.includes("iPhone") || userAgent.includes("iOS")) {
      return { device: "iPhone", platform: "Instagram App" };
    }
  }
  
  // Browser detection
  if (userAgent.includes("Firefox")) {
    return { device: "Desktop", platform: "Firefox" };
  } else if (userAgent.includes("Edg/")) {
    return { device: "Desktop", platform: "Edge" };
  } else if (userAgent.includes("Chrome")) {
    return { device: "Desktop", platform: "Chrome" };
  } else if (userAgent.includes("Safari")) {
    return { device: "Desktop", platform: "Safari" };
  }
  
  return { device: "Unknown", platform: "Unknown" };
}
