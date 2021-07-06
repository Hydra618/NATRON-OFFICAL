const Discord = require("discord.js")

module.exports = {
   name: "rrembed",
   aliases: [" "],
   category: " ",

    run: (client, message, args) => {
      let say = message.content.split(" ").slice(1).join(" ")
      
      
      const embed = new Discord.MessageEmbed()
      .setDescription(say)
      .setColor(`RANDOM`)
      message.channel.send(embed)
   }
}