const Discord = require("discord.js");
const db = require("quick.db")

module.exports = {
  name: "setvcrole",
  
  run: async (client, message, args) => {
    
    if(!message.member.hasPermission("ADMINSTRATOR")) return message.channel.send("You must have `ADMINSTRATOR` permission")
    
    const role = message.mentions.roles.first()
    
    if(!role) return message.channel.send("you must mention a role")
    
    db.set(`vcrole_${message.guild.id}`, role.id)
    
   let embed = new Discord.MessageEmbed()
    .setDescription(`${role} This role is now in-vc role\n\nThis role will be added when aanyone join vc`)
    
    await message.channel.send(embed)
  }
}