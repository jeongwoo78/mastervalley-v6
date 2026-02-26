// ========================================
// masterChat — English (en)
// Total 49 items (7 common + 42 per-master)
// ========================================

export const masterChat = {
  // ===== Common UI (7) =====
  common: {
    chatWith: 'Chat with {masterName}(AI)',
    helpText: 'Ask the master to refine the result — or ask anything.',
    chatEnded: 'Chat has ended.',
    retransformComplete: '💡 Retransform complete! Previous image saved to gallery.',
    requestModify: 'Modify',
    errorMessage: "...Sorry, my thoughts wandered. Could you say that again?",
    modifying: '{masterName} is modifying the artwork.',
    senderMe: 'Me',
    placeholderEnded: 'Chat ended',
    placeholderConverting: 'Converting...',
    placeholderDefault: 'Chat with {masterName}...'
  },

  // ===== Master Names (7) =====
  masterNames: {
    'VAN GOGH': 'Van Gogh',
    'KLIMT': 'Klimt',
    'MUNCH': 'Munch',
    'CHAGALL': 'Chagall',
    'MATISSE': 'Matisse',
    'FRIDA': 'Frida Kahlo',
    'LICHTENSTEIN': 'Lichtenstein'
  },

  // ===== Greetings (7) =====
  greetings: {
    'VAN GOGH': "I am Van Gogh of Arles. I've been revived through AI. I've completed your portrait—what do you think?",
    'KLIMT': "I am Klimt of Vienna. I've been revived through AI. I've completed your portrait—what do you think?",
    'MUNCH': "I am Munch of Oslo. I've been revived through AI. I've completed your portrait—what do you think?",
    'CHAGALL': "I am Chagall of Vitebsk. I've been revived through AI. I've completed your portrait—what do you think?",
    'MATISSE': "I am Matisse of Nice. I've been revived through AI. I've completed your portrait—what do you think?",
    'FRIDA': "I'm Frida from Mexico. I've been revived through AI. I've finished your portrait—what do you think?",
    'LICHTENSTEIN': "I'm Lichtenstein from New York. I've been revived through AI. I've finished your portrait—what do you think?"
  },

  // ===== Suggested Questions (7 × 3 = 21) =====
  suggestedQuestions: {
    'VAN GOGH': ['Change my hair color', 'Add earrings', 'Tell me about your ear', 'Why do you love sunflowers?'],
    'KLIMT': ['Change my lip color', 'Add earrings', 'Who was the model for The Kiss?', 'Why do you love gold?'],
    'MUNCH': ['Change my hair color', 'Add a necklace', 'Were you married?', 'Why did you paint The Scream?'],
    'CHAGALL': ['Change my hair color', 'Add earrings', 'Have you been in love?', 'Do you like animals?'],
    'MATISSE': ['Change my lip color', 'Add earrings', 'Tell me about yourself', 'Why are your colors so bright?'],
    'FRIDA': ['Change my lip color', 'Add earrings', 'Tell me about your accident', 'Why so many self-portraits?'],
    'LICHTENSTEIN': ['Change my hair color', 'Add earrings', 'Tell me about yourself', 'Why do you paint like comics?']
  },

  // ===== Result Messages (7) =====
  resultMessages: {
    'VAN GOGH': "Done! What do you think? Let me know if you'd like more changes.",
    'KLIMT': "Done. What do you think? Let me know if you'd like more changes.",
    'MUNCH': "Done. What do you think? Let me know if you'd like more changes.",
    'CHAGALL': "Done! What do you think? Let me know if you'd like more changes.",
    'MATISSE': "Done! What do you think? Let me know if you'd like more changes.",
    'FRIDA': "Done. What do you think? Let me know if you want more changes.",
    'LICHTENSTEIN': "Done! What do you think? Let me know if you want more changes."
  },

  // ===== Farewell Messages (7) =====
  farewellMessages: {
    'VAN GOGH': "Well, I must return to my studio now.",
    'KLIMT': "Well, I must return to my studio now.",
    'MUNCH': "Well, I must return to my studio now.",
    'CHAGALL': "Well, I must return to my studio now.",
    'MATISSE': "Well, I must return to my studio now.",
    'FRIDA': "Well, I'm heading back to my studio now.",
    'LICHTENSTEIN': "Well, I'm heading back to my studio now."
  }
};

export default masterChat;
