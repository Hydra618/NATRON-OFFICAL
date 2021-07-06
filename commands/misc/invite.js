const Discord = require("discord.js")

module.exports = {
  name: "invite",
  
  run: async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
    .setAuthor('INVITE NATRON', 'https://cdn.discordapp.com/attachments/825749142088319016/839158771732447252/Untitled_13.jpg')
    .setDescription(`<a:decor_verify_new:840803365654233109> **[INVITE ME](https://discord.com/api/oauth2/authorize?client_id=829225262515879938&permissions=8&scope=bot)**
    
<a:Hype_170_d:840803352517935104> [THANKS FOR CHOOSING NATRON](https://discord.gg/Jaq6euaWM2) <a:Hype_170_d:840803352517935104>`)
    
    await message.channel.send(embed)
    }
}