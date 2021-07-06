const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
   name: "setvclogs",
   aliases: [""],
   category: " ",

    run: (client, message, args) => {
      
      if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("you must have `ADMINISTRATOR` permission")
      
      const channel = message.mentions.channels.first()
      if(!channel) return message.channel.send("mention a channel to set as vc logs channel")
      
      db.set(`vclog_${message.guild.id}`, channel.id)
      
      message.channel.send(`${channel} is set as vc logs channel`)
   }
}