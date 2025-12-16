/**
 * Parse Twitter security and account history data
 */

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
 * Parse direct messages for detailed analytics (like Instagram)
 * @param {Array} data - Parsed direct-messages.js content
 * @param {string} ownerId - Account owner's ID (optional, will be detected)
 * @returns {Object} Detailed DM analytics
 */
export function parseDirectMessages(data, ownerId = null) {
  let detectedOwnerId = ownerId;
  
  const conversations = (data || []).map(item => {
    const conv = item.dmConversation;
    const messages = conv?.messages || [];
    const convId = conv?.conversationId || '';
    
    // Get participants from conversation ID
    const participants = convId.split('-').filter(id => id);
    
    // Try to detect owner ID (most frequent sender across all conversations)
    if (!detectedOwnerId && messages.length > 0) {
      const senderId = messages[0]?.messageCreate?.senderId;
      if (senderId) {
        detectedOwnerId = senderId;
      }
    }

    // Analyze messages
    let sentCount = 0;
    let receivedCount = 0;
    let sentWithMedia = 0;
    let receivedWithMedia = 0;
    
    const otherParticipant = participants.find(p => p !== detectedOwnerId) || participants[0];

    messages.forEach(m => {
      const msg = m.messageCreate;
      if (!msg) return;
      
      const senderId = msg.senderId;
      const hasMedia = (msg.mediaUrls?.length || 0) > 0 || (msg.urls?.length || 0) > 0;
      
      if (senderId === detectedOwnerId) {
        sentCount++;
        if (hasMedia) sentWithMedia++;
      } else {
        receivedCount++;
        if (hasMedia) receivedWithMedia++;
      }
    });

    return {
      conversationId: convId,
      partner: otherParticipant,
      totalMessages: messages.length,
      sent: {
        total: sentCount,
        withMedia: sentWithMedia
      },
      received: {
        total: receivedCount,
        withMedia: receivedWithMedia
      },
      lastMessage: messages[0]?.messageCreate?.createdAt 
        ? new Date(messages[0].messageCreate.createdAt)
        : null
    };
  }).filter(c => c.totalMessages > 0);

  if (conversations.length === 0) {
    return {
      totalConversations: 0,
      totalMessages: 0,
      totals: {
        sent: 0,
        received: 0,
        sentMedia: 0,
        receivedMedia: 0
      },
      topByTotal: [],
      topBySent: [],
      topByReceived: []
    };
  }

  // Calculate totals
  const totals = {
    sent: 0,
    received: 0,
    sentMedia: 0,
    receivedMedia: 0
  };

  conversations.forEach(c => {
    totals.sent += c.sent.total;
    totals.received += c.received.total;
    totals.sentMedia += c.sent.withMedia;
    totals.receivedMedia += c.received.withMedia;
  });

  const totalMessages = totals.sent + totals.received;

  // Top conversations by different metrics
  const topByTotal = [...conversations]
    .sort((a, b) => b.totalMessages - a.totalMessages)
    .slice(0, 10);

  const topBySent = [...conversations]
    .sort((a, b) => b.sent.total - a.sent.total)
    .slice(0, 10);

  const topByReceived = [...conversations]
    .sort((a, b) => b.received.total - a.received.total)
    .slice(0, 10);

  return {
    ownerId: detectedOwnerId,
    totalConversations: conversations.length,
    totalMessages,
    totals,
    topByTotal,
    topBySent,
    topByReceived
  };
}
