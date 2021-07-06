const Discord = require("discord.js") 

module.exports = {
  name: "owner", 
  
  run: async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
    .setTitle ("<a:bot:840803359589007391>  OWNER INFO  <a:bot:840803359589007391>")
    .addField("DEVELOPERS", `<@824691356646637588> (\`hydra\`)\n<@721572633338052659> (\`joker\`) `)
    .addField("ERRORS", `<a:decor_verify_new:840803365654233109> There are some errors or glitches present in commands so if you got error pls contact me I will solve it (\`or join support server\`) `) 
    .setDescription("<a:Hype_170_d:840803352517935104> Hope you enjoy the bot with lots of cmds and stay safe <a:Hype_170_d:840803352517935104>") 
    
    await message.channel.send(embed) 
    }
}