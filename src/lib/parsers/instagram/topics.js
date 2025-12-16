/**
 * Parse Instagram recommended topics/interests
 */

/**
 * Parse recommended topics
 * @param {Object} data - Parsed recommended_topics.json content
 * @returns {Object} Processed topics data
 */
export function parseTopics(data) {
  const topics = (data?.topics_your_topics || [])
    .map(item => item.string_map_data?.["Ad"]?.value || item.string_map_data?.["Name"]?.value)
    .filter(Boolean);

  // Categorize topics
  const categories = categorizeTopics(topics);

  return {
    total: topics.length,
    topics,
    categories
  };
}

function categorizeTopics(topics) {
  const categories = {
    'Spor': [],
    'Yemek & İçecek': [],
    'Oyun & Teknoloji': [],
    'Moda & Güzellik': [],
    'Hayvanlar': [],
    'Sanat & Eğlence': [],
    'Seyahat': [],
    'Diğer': []
  };

  const categoryKeywords = {
    'Spor': ['soccer', 'basketball', 'football', 'sports', 'running', 'gym', 'workout', 'swimming'],
    'Yemek & İçecek': ['food', 'drink', 'coffee', 'recipe', 'cuisine', 'baked', 'dessert', 'sandwich', 'ice cream', 'alcoholic', 'beverage'],
    'Oyun & Teknoloji': ['game', 'video game', 'ar/vr', 'gaming', 'tech'],
    'Moda & Güzellik': ['fashion', 'beauty', 'hair', 'clothing', 'swimwear', 'accessories'],
    'Hayvanlar': ['dog', 'cat', 'bird', 'animal', 'chicken', 'mammal', 'monkey', 'primate', 'farm animal'],
    'Sanat & Eğlence': ['art', 'movie', 'tv', 'anime', 'music', 'drawing', 'visual', 'animation', 'celebrity', 'guitar', 'instrument'],
    'Seyahat': ['travel', 'beach', 'destination', 'nature', 'landmark', 'aviation']
  };

  topics.forEach(topic => {
    const lowerTopic = topic.toLowerCase();
    let categorized = false;

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(kw => lowerTopic.includes(kw))) {
        categories[category].push(topic);
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      categories['Diğer'].push(topic);
    }
  });

  // Remove empty categories
  return Object.fromEntries(
    Object.entries(categories).filter(([, items]) => items.length > 0)
  );
}
