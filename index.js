//Create a discord server bot using OpenAI API that interacts on Discord server
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

//Prepare to connect to discord API
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Prepare connection to OpenAPI API
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

//Check for when a message on discord is sent
client.on("messageCreate", async message => {
  try {
    //Don't responsd to self bot or other bots
    if (message.author.bot) return;

    const chatGptRespone = await openai.createCompletion({
      model: "davinci",
      prompt: `ChatGPT is a friendly chatbot.\n\
      ChatGPT: Hello, how are you?\n\
      ${message.author.username}: ${message.content}\n
      ChatGPT:`,
      max_tokens: 500,
      temperature: 0.6,
      stop: ["ChatGPT:", "TheRealAbhinav:", "taksuparth:"],
    });
    console.log(chatGptRespone.data);
    message.reply(chatGptRespone.data.choices[0].text);
    return;
  } catch (error) {
    console.error(error);
  }
});

//Log the bot into the Discord server
client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT bot is now online on Discord!!");
