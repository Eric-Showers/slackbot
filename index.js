const Botkit = require('botkit');
const emojiFromWord = require('emoji-from-word');

const dotenv = require('dotenv');
dotenv.load();

const port = process.env.PORT || 3000;
const controller = Botkit.slackbot({
    debug: false
});

controller.setupWebserver(port, (err) => {
    if (err) console.log(err);
    console.log(`Magic happens on port ${port}`);
});

controller.spawn({
    token: process.env.SLACK_API_TOKEN
}).startRTM();

//Do stuff with bot

const createReaction = (message, emoji) => ({
    timestamp: message.ts,
    channel: message.channel,
    name: emoji
});

//Respond to greetings
controller.hears('hello',  ['direct_message', 'direct_mention'], 
    (bot, message) => {
        bot.reply(message, 'Hey there 👋');
    }
);

//Taunt Dan
controller.hears('by Daniel Frankcom', ['direct_message','ambient'], (bot, message) => {
    bot.api.reactions.add(createReaction(message, 'nerd_face'));
	}
);

//Initiate poll
controller.hears('vote!', ['ambient'], (bot, message) => {
    bot.api.reactions.add(createReaction(message, 'thumbsup'));
    bot.api.reactions.add(createReaction(message, 'thumbsdown'));
});

controller.hears(' Dan ', ['ambient'], (bot, message) => {
    bot.reply(message, 'He\'s the man!');
});

controller.hears(':isis:', ['ambient'], (bot, message) => {
    bot.reply(message, 'Soon my brothers!');
});

//Tries to find relevant emojis to the text given
controller.hears('.+', ['mention', 'direct_mention', 'direct_message'], (bot, message) =>  {
    // Get text from message
    const text = message.text.toLowerCase().trim();

    // split message on [space] character
    const words = text.split(' ');

    // Loop through all the words
    words.forEach((word) => {
        word = word.trim();

        // Try and match the word to an emoji
        const emoji = emojiFromWord(word);

        // If an emoji was found with confidence > 93%
        //  add the emoji as a reaction
        if (emoji.emoji_name && emoji.score > 0.93) {
            bot.api.reactions.add(createReaction(message, emoji.emoji_name));
        }
    });
});