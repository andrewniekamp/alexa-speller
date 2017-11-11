const cards = {
  launchCard: {
    prompt: 'Hello! Let\'s practice your spelling.',
    title: 'Welcome',
    content: 'You can ask me for a word, and specify by grade two through eight, if you like.',
    imgObj: {
      smallImageUrl: `https://source.unsplash.com/720x480/?bee`, // Bee image
      largeImageUrl: `https://source.unsplash.com/1200x800/?bee` // Bee image
    }
  },
  prompts: {
    launch: 'Hello! Let\'s practice your spelling.',
  },
  reprompts: {

  },
  titles: {
    launch: 'Welcome',
  },
  contents: {
    wordPrompt: 'You can ask me for a word, and specify by grade two through eight, if you like.',
  },
  imageObj: {
    smallImageUrl: `https://source.unsplash.com/720x480/?`, // Concat word
    largeImageUrl: `https://source.unsplash.com/1200x800/?` // Concat word
  },
  general: {
    wordReqInst: 'You can ask me for a word, and specify by grade two through eight, if you like.',
  }
}

module.exports = cards;
