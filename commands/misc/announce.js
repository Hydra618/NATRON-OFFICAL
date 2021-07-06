const Discord = require("discord.js");

module.exports = {
  name: "announce",
  category: "info",
  usage: "announce <#channel> <message>",
  description: "announce a message in specified channel",
  run: async (client, message, args) => {
    
      let say = message.content.split(" ").slice(1).join(" ")
    
    let embed = new Discord.MessageEmbed()
      .setColor(`RANDOM`)
      .setTitle("<a:gwelcome:840803349569601547> ANNOUNCEMENT!")
      .setDescription(say)
      .setTimestamp();
    message.channel.send(embed)
  }
};
