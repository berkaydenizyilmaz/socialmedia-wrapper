/**
 * Parse Twitter security and account history data
 */

/**
 * Parse IP audit data for login activity analysis
 * @param {Array} data - Parsed ip-audit.js content
 * @returns {Object} Processed login activity data
 */
export function parseIpAudit(data) {
  const logins = (data || []).map(item => {
    const audit = item.ipAudit;
    return {
      ip: audit?.loginIp,
      createdAt: audit?.createdAt ? new Date(audit.createdAt) : null
    };
  }).filter(l => l.ip);

  // IP frequency
  const ipCounts = {};
  logins.forEach(l => {
    ipCounts[l.ip] = (ipCounts[l.ip] || 0) + 1;
  });
  const topIps = Object.entries(ipCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([ip, count]) => ({ ip, count }));

  // Login times by hour (for heatmap)
  const hourCounts = Array(24).fill(0);
  logins.forEach(l => {
    if (l.createdAt) {
      const hour = l.createdAt.getHours();
      hourCounts[hour]++;
    }
  });
  const loginsByHour = hourCounts.map((count, hour) => ({ hour, count }));

  // Unique IPs count
  const uniqueIps = Object.keys(ipCounts).length;

  // Recent logins
  const recentLogins = logins
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 20);

  return {
    total: logins.length,
    uniqueIps,
    topIps,
    loginsByHour,
    recentLogins
  };
}

/**
 * Parse screen name change history
 * @param {Array} data - Parsed screen-name-change.js content
 * @returns {Object} Username change history
 */
export function parseScreenNameChanges(data) {
  const changes = (data || []).map(item => {
    const change = item.screenNameChange?.screenNameChange;
    return {
      from: change?.changedFrom,
      to: change?.changedTo,
      date: change?.changedAt ? new Date(change.changedAt) : null
    };
  }).filter(c => c.from && c.to);

  // Sort by date
  changes.sort((a, b) => a.date - b.date);

  return {
    total: changes.length,
    history: changes
  };
}

/**
 * Parse muted accounts
 * @param {Array} data - Parsed mute.js content
 * @returns {Object} Muted accounts info
 */
export function parseMutes(data) {
  const mutes = (data || []).map(item => ({
    accountId: item.muting?.accountId,
    userLink: item.muting?.userLink
  })).filter(m => m.accountId);

  return {
    total: mutes.length,
    mutes
  };
}

/**
 * Parse direct messages for analytics
 * @param {Array} data - Parsed direct-messages.js content
 * @returns {Object} DM analytics
 */
export function parseDirectMessages(data) {
  const conversations = (data || []).map(item => {
    const conv = item.dmConversation;
    const messages = conv?.messages || [];
    
    return {
      conversationId: conv?.conversationId,
      messageCount: messages.length,
      participants: getParticipantsFromConvId(conv?.conversationId),
      messages: messages.map(m => ({
        senderId: m.messageCreate?.senderId,
        recipientId: m.messageCreate?.recipientId,
        text: m.messageCreate?.text,
        date: m.messageCreate?.createdAt ? new Date(m.messageCreate.createdAt) : null,
        hasMedia: (m.messageCreate?.mediaUrls?.length || 0) > 0
      }))
    };
  });

  // Total message count
  const totalMessages = conversations.reduce((sum, c) => sum + c.messageCount, 0);
  
  // Messages sent vs received (need account ID)
  // Top conversations by message count
  const topConversations = conversations
    .sort((a, b) => b.messageCount - a.messageCount)
    .slice(0, 10)
    .map(c => ({
      conversationId: c.conversationId,
      messageCount: c.messageCount
    }));

  return {
    totalConversations: conversations.length,
    totalMessages,
    topConversations
  };
}

function getParticipantsFromConvId(convId) {
  if (!convId) return [];
  return convId.split('-').filter(id => id);
}
