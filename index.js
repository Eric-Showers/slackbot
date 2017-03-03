const Botkit = require('botkit');

const dotenv = require('dotenv');
dotenv.load();

const port = process.env.PORT || 3000;
const controller = Botkit.slackbot({
    debug: true
});

controller.setupWebserver(port, (err) => {
    if (err) console.log(err);
    console.log(`Magic happens on port ${port}`);
});

controller.spawn({
    //token: "xoxb-145209201155-RUhyiCdHPseggkj9jcbmAVys"
    token: process.env.SLACK_API_TOKEN
}).startRTM();

const createReaction = (message, emoji) => ({
    timestamp: message.ts,
    channel: message.channel,
    name: emoji
});

controller.hears('hello',  ['direct_message', 'direct_mention'], 
    (bot, message) => {
        bot.reply(message, 'Hey there 👋');
    }
);

controller.hears('by Daniel Frankcom', ['direct_message','ambient'], (bot, message) => {
    bot.api.reactions.add(createReaction(message, 'nerd_face'));
	}
);

controller.hears('vote!', ['ambient'], (bot, message) => {
    bot.api.reactions.add(createReaction(message, 'thumbsup'));
    bot.api.reactions.add(createReaction(message, 'thumbsdown'));
});