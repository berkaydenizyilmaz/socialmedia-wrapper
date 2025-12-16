/**
 * Parse Instagram Direct Messages
 */

import { fixTurkishChars } from "@/lib/utils";

/**
 * Parse all DM conversations from inbox folder
 * @param {Object} files - File map from readDirectory
 * @param {string} ownerName - Account owner's name (to distinguish sent vs received)
 * @returns {Object} Processed DM statistics
 */
export async function parseDirectMessages(files, ownerName = null) {
  const conversations = [];
  let detectedOwnerName = ownerName;
  
  // Find all message files in inbox
  const messageFiles = Object.entries(files).filter(([path]) => 
    path.includes('/messages/inbox/') && path.endsWith('message_1.json')
  );

  if (messageFiles.length === 0) {
    return null;
  }

  for (const [path, file] of messageFiles) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const participants = data.participants || [];
      const messages = data.messages || [];
      
      if (messages.length === 0) continue;

      // Try to detect owner name from the first conversation
      if (!detectedOwnerName && participants.length === 2) {
        // Owner is likely the one who appears most as sender across conversations
        const senderCounts = {};
        messages.forEach(m => {
          const sender = fixTurkishChars(m.sender_name);
          senderCounts[sender] = (senderCounts[sender] || 0) + 1;
        });
        // For now, we'll determine owner later by aggregating all conversations
      }

      // Get the other participant's name (not the owner)
      const otherParticipant = participants.find(p => 
        fixTurkishChars(p.name) !== detectedOwnerName
      );
      const chatPartner = fixTurkishChars(otherParticipant?.name || 'Unknown');

      // Analyze messages
      let sentCount = 0;
      let receivedCount = 0;
      let sentTextCount = 0;
      let receivedTextCount = 0;
      let sentShareCount = 0;
      let receivedShareCount = 0;
      let reactionsSent = 0;
      let reactionsReceived = 0;

      const senderStats = {};
      
      messages.forEach(msg => {
        const sender = fixTurkishChars(msg.sender_name);
        const isShare = !!msg.share;
        const hasReactions = msg.reactions?.length > 0;
        
        if (!senderStats[sender]) {
          senderStats[sender] = { total: 0, text: 0, shares: 0 };
        }
        senderStats[sender].total++;
        if (isShare) {
          senderStats[sender].shares++;
        } else {
          senderStats[sender].text++;
        }

        // Count reactions received on this message
        if (hasReactions) {
          msg.reactions.forEach(r => {
            const reactor = fixTurkishChars(r.actor);
            if (reactor !== sender) {
              // This person reacted to this message
              if (reactor === chatPartner) {
                reactionsReceived++;
              } else {
                reactionsSent++;
              }
            }
          });
        }
      });

      // Determine stats for each sender
      Object.entries(senderStats).forEach(([sender, stats]) => {
        if (sender === chatPartner) {
          receivedCount = stats.total;
          receivedTextCount = stats.text;
          receivedShareCount = stats.shares;
        } else {
          sentCount = stats.total;
          sentTextCount = stats.text;
          sentShareCount = stats.shares;
          if (!detectedOwnerName) {
            detectedOwnerName = sender;
          }
        }
      });

      conversations.push({
        partner: chatPartner,
        totalMessages: messages.length,
        sent: {
          total: sentCount,
          text: sentTextCount,
          shares: sentShareCount
        },
        received: {
          total: receivedCount,
          text: receivedTextCount,
          shares: receivedShareCount
        },
        reactionsSent,
        reactionsReceived,
        lastMessage: messages[0]?.timestamp_ms 
          ? new Date(messages[0].timestamp_ms) 
          : null
      });
    } catch (err) {
      // Skip invalid files
      console.error('Error parsing DM:', path, err);
    }
  }

  if (conversations.length === 0) {
    return null;
  }

  // Calculate totals
  const totals = {
    conversations: conversations.length,
    totalMessages: 0,
    totalSent: 0,
    totalReceived: 0,
    totalSentText: 0,
    totalReceivedText: 0,
    totalSentShares: 0,
    totalReceivedShares: 0,
    totalReactionsSent: 0,
    totalReactionsReceived: 0
  };

  conversations.forEach(c => {
    totals.totalMessages += c.totalMessages;
    totals.totalSent += c.sent.total;
    totals.totalReceived += c.received.total;
    totals.totalSentText += c.sent.text;
    totals.totalReceivedText += c.received.text;
    totals.totalSentShares += c.sent.shares;
    totals.totalReceivedShares += c.received.shares;
    totals.totalReactionsSent += c.reactionsSent;
    totals.totalReactionsReceived += c.reactionsReceived;
  });

  // Top conversations by total messages
  const topByTotal = [...conversations]
    .sort((a, b) => b.totalMessages - a.totalMessages)
    .slice(0, 10);

  // Top by text messages I sent (excluding shares)
  const topBySentText = [...conversations]
    .sort((a, b) => b.sent.text - a.sent.text)
    .slice(0, 10);

  // Top by text messages received (excluding shares)
  const topByReceivedText = [...conversations]
    .sort((a, b) => b.received.text - a.received.text)
    .slice(0, 10);

  // Top by shares received (reels/posts they sent me)
  const topByReceivedShares = [...conversations]
    .sort((a, b) => b.received.shares - a.received.shares)
    .slice(0, 10);

  // Top by shares sent (reels/posts I sent them)
  const topBySentShares = [...conversations]
    .sort((a, b) => b.sent.shares - a.sent.shares)
    .slice(0, 10);

  return {
    ownerName: detectedOwnerName,
    totals,
    topByTotal,
    topBySentText,
    topByReceivedText,
    topByReceivedShares,
    topBySentShares
  };
}
