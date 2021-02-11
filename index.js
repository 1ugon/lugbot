const express = require("express");
const dotenv = require("dotenv").config();
const { ApiClient } = require("twitch");
const { ClientCredentialsAuthProvider } = require("twitch-auth");
const authProvider = new ClientCredentialsAuthProvider(
  process.env.CLIENT,
  process.env.TWITCHTOKEN
);
const apiClient = new ApiClient({ authProvider });

const token = process.env.TOKEN;
const port = process.env.PORT;

const app = express();

app.listen(port);

app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Pingou às ${ping.getUTCHours()}:${ping.getUTCMinutes()}`);
  response.sendStatus(200);
});

const Discord = require("discord.js");

const client = new Discord.Client();

const config = require("./config.json");
const { response } = require("express");

client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.type == "dm") return;
  if (!message.content.toLowerCase().startsWith(config.prefix)) return;
  if (
    message.content.startsWith(`<@!${client.user.id}>`) ||
    message.content.startsWith(`<@${client.user.id}>`)
  )
    return;

  const args = message.content.trim().slice(config.prefix.length).split(/ +/g);
  const command = args.shift().toLowerCase();

  try {
    const commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    console.error("Erro: " + err);
  }
});

client.on("ready", () => {
  getStream();
});

async function getStream() {
  const stream = await apiClient.helix.streams.getStreamByUserName("lugondev");

  if (stream === null) {
    console.log("stream is offline");
  } else {
    const channel = client.channels.cache.find(
      (channel) => channel.name == "geral💌"
    );
    channel.send(
      `Stream online -> ${stream.title} \nhttps://www.twitch.tv/lugondev`
    );
  }
}

client.login(token);
