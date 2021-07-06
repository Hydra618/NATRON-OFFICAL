const Discord = require("discord.js")

module.exports = {
  name: "embed",
  description: "it asks you what is title, footer, description you answer",
  run: async (client, message, args) => {
      
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("you must have admin perms")
    
    let Embed = new Discord.MessageEmbed()
    
    await message.channel.send(
          "What would be the title?"
        );
        await message.channel
          .awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000,
            errors: ["time"]
          })
          .then(collected => {
            Embed.setTitle(collected.first().content);
          });
        await message.channel.send(
          "What Should be the Description?"
        );
        await message.channel
          .awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000,
            errors: ["time"]
          })
          .then(collectedx => {
            Embed.setDescription(collectedx.first().content);
          });
        await message.channel.send(
          "What would be the Footer?"
        );
        message.channel
          .awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000,
            errors: ["time"]
          })
          .then(collectedy => {
            Embed.setFooter(collectedy.first().content);
            message.channel.send(Embed);
          });
      }
    }