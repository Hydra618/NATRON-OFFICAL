const Discord = require("discord.js")

module.exports = {
  name: "botrules",
  
  run: async (client, message, args) => {
    let bembed = new Discord.MessageEmbed()
    .setTitle("<a:info5:840813674796417075> BOT RULES <a:info5:840813674796417075>")
    .setDescription("**<a:hell_arrow:840803350727753769> This are the rules, glitches and errors**\n**<a:hell_arrow:840803350727753769> Hope you understand this things**\n\n\n**<a:pink_heart:840803358855397446> Hope you enjoy my stuff <a:pink_heart:840803358855397446>**")
    .addField("BOT TYPES", `<a:decor_1:840803365105041408> This is a security, fun, moderation, music, misc, config, information bot\n\n<a:decor_2:840803361746190336> This bot not a nfsw content bot `)
    .addField("BOT PROBLEMS", `<a:hell_arrow:840803350727753769> For announce or embed commands, Emojis in the server can only be used`)
    
    message.channel.send(bembed)
  }
}