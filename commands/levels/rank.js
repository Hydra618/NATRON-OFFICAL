const db = require('quick.db')
const { getInfo } = require("../../handlers/xp.js")
const canvacord = require("canvacord");
const Discord = require("discord.js");
module.exports = {
  name: "level",
  aliases: ["lvl", "rank"],
  description: "Get the level of Author or Mentioned",
  usage: "level [user]",
  category: "info",
  run: (client, message, args) => {
    const user = message.mentions.users.first() || message.author;
    const rankbg = "https://cdn.discordapp.com/embed/avatars/4.png"
    let data = db.all().filter(i => i.ID.startsWith("xp_")).sort((a, b) => b.data - a.data);
    let uf = data.map(x => x.ID).indexOf(`xp_${user.id}`) + 1;
    
    if(user.bot) {
      return message.channel.send("Bots Don't Have Levels! Even Me...")
    }
    
    let xp = db.get(`xp_${user.id}_${message.guild.id}`) || 0;
    
    const {level, remxp, levelxp} = getInfo(xp);
    let every = db.all().filter(i => i.ID.startsWith("xp_")).sort((a, b) => b.data - a.data);
  let rak = every.map(x => x.ID).indexOf(`xp_${user.id}`) + 1;

    
const rank = new canvacord.Rank()
    .setAvatar(user.displayAvatarURL({dynamic: false,  format: 'png'}))
    .setBackground("IMAGE", rankbg)
    .setCurrentXP(remxp)
    .setRequiredXP(levelxp)
    .setLevel(level)
    .setRank(uf)
    .setStatus(user.presence.status)
    .setProgressBar("#00FFFF", "COLOR")
    .setUsername(user.username)
    .setDiscriminator(user.discriminator)

rank.build()
    .then(data => {
        const attachment = new Discord.MessageAttachment(data, `zRank.png`);
        message.channel.send(attachment);
    });   
    
    
    
    
  }
}