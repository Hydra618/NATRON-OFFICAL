const { token, prefix } = require("./config.json");
const { config } = require("dotenv");
const Discord = require("discord.js");
 const client = new Discord.Client({ 
 disableMentions: 'everyone'
                                   
  });
require("discord-buttons")
const db = require("quick.db"); //WE WILL BE USING QUICK.DB
/*const Economy = require("quick.eco");
client.eco = new Economy.M
client.db = Economy.db; // quick.db
**/

const { addexp } = require("./handlers/xp.js")
const dashboard = require('./dashboard/index')
dashboard(client);


const config1 = require('./util/gw-config.json');

const { GiveawaysManager } = require("discord-giveaways");

client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./json db/giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: config1.botsCanWin,
        embedColor: config1.embedColor,
        embedColorEnd: config1.embedColorEnd,
        reaction: config1.reaction
    }
});
// We now have a client.giveawaysManager property to manage our giveaways!

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    if (member.id !== client.user.id){
        console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
    }
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    if (member.id !== client.user.id){
        console.log(`${member.user.tag} left giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
    }
});


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();


//music system
const { Player } = require('discord-player');
const player = new Player(client, {
	enableLive: true,
	autoSelfDeaf: true,
	leaveOnEnd: true,
	leaveOnEndCooldown: 5000,
	leaveOnEmpty: true,
	leaveOnStop: true
});
client.player = player;

const { CanvasSenpai } = require("canvas-senpai")
const canva = new CanvasSenpai();

["command", "events"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
  //When bot is ready
  console.log("I am Reday to Go");
  client.user.setActivity(db.get(`status`)); //It will set status :)
});

//IS URL FUNCTI


//.     LOGS       ////

const logs = require('discord-logs');
logs(client);
client.emotes = require('./config/emotes.json');


client.on('messageDelete', message => {
    const logs = db.get(`logs_${message.guild.id}`)
  
    const LogChannel = client.channels.cache.get(logs)
    const DeletedLog = new Discord.MessageEmbed()
    .setTitle("Deleted Message")
    .addField('Deleted by', `${message.author} - (${message.author.id})`)
    .addField("In", message.channel)
    .addField('Content', message.content)
    .setColor('RANDOM')
    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
    LogChannel.send(DeletedLog)

})

client.on('messageUpdate', async(oldMessage, newMessage) => {
   const logs = db.get(`logs_${newMessage.guild.id}`)
  
  const LogChannel = client.channels.cache.get(logs)
    const EditedLog = new Discord.MessageEmbed()
    .setTitle("Edited Message")
    .addField('Edited by', `${oldMessage.author} - (${oldMessage.author.id})`)
    .addField("In", oldMessage.channel)
    .addField('Old Message', oldMessage)
    .addField('New Message', newMessage.content)
    .setColor('RANDOM')
    .setThumbnail(oldMessage.author.displayAvatarURL({dynamic: true}))
    await LogChannel.send(EditedLog)

})

client.on("guildChannelPermissionsUpdate", (channel, oldPermissions, newPermissions) => {
  let embedcolor = db.fetch(`logs_embedcolor_${channel.guild.id}`);
  let logchannel = db.fetch(`logs_${channel.guild.id}`)
          if (!logchannel) return;

          const embed = new Discord.MessageEmbed()
              .setAuthor(channel.guild.name, channel.guild.iconURL())
              .setColor(embedcolor || 'BLACK')
              .setFooter(client.user.username, client.user.avatarURL())
              .setDescription(`⚒️ **Channel ${channel} got updated!**`)
              .setTimestamp();

          var sChannel = channel.guild.channels.cache.get(logchannel)
          if (!sChannel) return;
          sChannel.send(embed)
});

client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {
  let embedcolor = db.fetch(`logs_embedcolor_${channel.guild.id}`);
  let logchannel = db.fetch(`logs_${channel.guild.id}`)
          if (!logchannel) return;
if(oldTopic == null) {
  oldTopic == "no topic was set"
}
          const embed = new Discord.MessageEmbed()
                .setAuthor(channel.guild.name, channel.guild.iconURL())
                .setColor(embedcolor || 'BLACK')
                .setFooter(client.user.username, client.user.avatarURL())
                .setDescription('⚒️ **Channel Topic Changed**')
                .addField("Old topic ", `\`\`\`${oldTopic}\`\`\``, true)
                .addField("New topic ", `\`\`\`${newTopic}\`\`\``, true)
                .setTimestamp();

          var sChannel = channel.guild.channels.cache.get(logchannel)
          if (!sChannel) return;
          sChannel.send(embed)
});

client.on("guildMemberRoleAdd", (member, role) => {
  let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
  let logchannel = db.fetch(`logs_${member.guild.id}`)
          if (!logchannel) return;

          const embed = new Discord.MessageEmbed()
                .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({dynamic:true}))
                .setColor(embedcolor || 'BLACK')
                .setFooter(client.user.username, client.user.avatarURL())
                .setDescription(`✍️ <@${member.user.id}> **has been updated.**`)
                .addField("Roles:", `${client.emotes.yes} ${role}`, true)
                .setThumbnail(member.user.avatarURL({dynamic:true}))
                .setTimestamp();

          var sChannel = member.guild.channels.cache.get(logchannel)
          if (!sChannel) return;
          sChannel.send(embed)
});

client.on("guildMemberRoleRemove", (member, role) => {
  let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
  let logchannel = db.fetch(`logs_${member.guild.id}`)
          if (!logchannel) return;

          const embed = new Discord.MessageEmbed()
                .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({dynamic:true}))
                .setColor(embedcolor || 'BLACK')
                .setFooter(client.user.username, client.user.avatarURL())
                .setDescription(`✍️ <@${member.user.id}> **has been updated.**`)
                .addField("Roles:", `${client.emotes.no} ${role}`, true)
                .setThumbnail(member.user.avatarURL({dynamic:true}))
                .setTimestamp();

          var sChannel = member.guild.channels.cache.get(logchannel)
          if (!sChannel) return;
          sChannel.send(embed)
});

client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
  let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
  let logchannel = db.fetch(`nicklog_${member.guild.id}`)
          if (!logchannel) return;

          const embed = new Discord.MessageEmbed()
                .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({dynamic:true}))
                .setColor(embedcolor || 'BLACK')
                .setFooter(client.user.username, client.user.avatarURL())
                .setDescription(`✍️ <@${member.user.id}> **has been updated.**`)
                .addField("Old nickname: ", `\`\`\`${oldNickname}\`\`\`` || `\`\`\`${member.user.username}\`\`\``, true)
                .addField("New nickname: ", `\`\`\`${newNickname}\`\`\`` || `\`\`\`${member.user.username}\`\`\``, true)
                .setThumbnail(member.user.avatarURL({dynamic:true}))
                .setTimestamp();

          var sChannel = member.guild.channels.cache.get(logchannel)
          if (!sChannel) return;
          sChannel.send(embed)
});

client.on("guildMemberBoost", (member) => {
      let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
      let logchannel = db.fetch(`logs_${member.guild.id}`)
              if (!logchannel) return;
    
              const embed = new Discord.MessageEmbed()
                    .setAuthor(`${member.guild.name}`, member.user.avatarURL({dynamic:true}))
                    .setColor(embedcolor || 'BLACK')
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setDescription(`${client.emotes.boost} <@${member.user.id}> **has boosted the server!.**`)
                    .setThumbnail(member.user.avatarURL({dynamic:true}))
                    .setTimestamp();
    
              var sChannel = member.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildMemberUnboost", (member) => {
      let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
      let logchannel = db.fetch(`logs_${member.guild.id}`)
              if (!logchannel) return;
    
              const embed = new Discord.MessageEmbed()
                    .setAuthor(`${member.guild.name}`, member.user.avatarURL({dynamic:true}))
                    .setColor(embedcolor || 'BLACK')
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setDescription(`${client.emotes.boost} <@${member.user.id}> **has unboosted the server!.**`)
                    .setThumbnail(member.user.avatarURL({dynamic:true}))
                    .setTimestamp();
    
              var sChannel = member.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildBoostLevelUp", (guild, oldLevel, newLevel) => {
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`)
              if (!logchannel) return;
    
              const embed = new Discord.MessageEmbed()
                    .setAuthor(`${guild.name}`, guild.iconURL())
                    .setColor(embedcolor || 'BLACK')
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setDescription(`${client.emotes.boost} **Server Boost Level Goes UP!.**`)
                    .addField("Old Level: ", `\`\`\`${oldLevel}\`\`\``, true)
                    .addField("New Level: ", `\`\`\`${newLevel}\`\`\``, true)
                    .setThumbnail(guild.iconURL())
                    .setTimestamp();
    
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildBoostLevelDown", (guild, oldLevel, newLevel) => {
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`)
              if (!logchannel) return;
    
              const embed = new Discord.MessageEmbed()
                    .setAuthor(`${guild.name}`, guild.iconURL())
                    .setColor(embedcolor || 'BLACK')
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setDescription(`${client.emotes.boost} **Server Boost Level Goes DOWN!.**`)
                    .addField("Old Level: ", `\`\`\`${oldLevel}\`\`\``, true)
                    .addField("New Level: ", `\`\`\`${newLevel}\`\`\``, true)
                    .setThumbnail(guild.iconURL())
                    .setTimestamp();
    
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on('guildRegionUpdate', (guild, oldRegion, newRegion) => {
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`);
      const oldUpper = oldRegion.charAt(0).toUpperCase() + oldRegion.substring(1);
      const newUpper = newRegion.charAt(0).toUpperCase() + oldRegion.substring(1);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(guild.name, guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Server Region Changed**')
                  .addField("Old region ", `\`\`\`${oldUpper}\`\`\``, true)
                  .addField("New region ", `\`\`\`${newUpper}\`\`\``, true)
                  .setTimestamp();
  
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildBannerAdd", (guild, bannerURL) => {
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(guild.name, guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Server Banner Changed**')
                  .setImage(bannerURL)
                  .setTimestamp();
  
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("emojiCreate", function(emoji){
      let embedcolor = db.fetch(`logs_embedcolor_${emoji.guild.id}`);
      let logchannel = db.fetch(`logs_${emoji.guild.id}`);
              if (!logchannel) return;
            if(emoji.animated == true) {
              const embed = new Discord.MessageEmbed()
                  .setAuthor(emoji.guild.name, emoji.guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Server Emoji Created**')
                  .addField('Name: ', `\`\`\`${emoji.name}\`\`\``, false)
                  .addField('ID: ', `\`\`\`${emoji.id}\`\`\``, false)
                  .addField('Animated: ', `\`\`\`${emoji.animated}\`\`\``, false)
                  .addField('How it looks:', `<a:${emoji.name}:${emoji.id}>`, false)
                  .setTimestamp();
  
              var sChannel = emoji.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
            } else {
                  const embed2 = new Discord.MessageEmbed()
                  .setAuthor(emoji.guild.name, emoji.guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Server Emoji Created**')
                  .addField('Name: ', `\`\`\`${emoji.name}\`\`\``, false)
                  .addField('ID: ', `\`\`\`${emoji.id}\`\`\``, false)
                  .addField('Animated: ', `\`\`\`${emoji.animated}\`\`\``, false)
                  .addField('How it looks:', `<:${emoji.name}:${emoji.id}>`, false)
                  .setTimestamp();
  
              var sChannel2 = emoji.guild.channels.cache.get(logchannel)
              if (!sChannel2) return;
              sChannel2.send(embed2)
            }
});

client.on("emojiDelete", function(emoji){
      let embedcolor = db.fetch(`logs_embedcolor_${emoji.guild.id}`);
      let logchannel = db.fetch(`logs_${emoji.guild.id}`);
              if (!logchannel) return;
              const embed = new Discord.MessageEmbed()
                  .setAuthor(emoji.guild.name, emoji.guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Server Emoji Deleted**')
                  .addField('Name: ', `\`\`\`${emoji.name}\`\`\``, false)
                  .addField('ID: ', `\`\`\`${emoji.id}\`\`\``, false)
                  .addField('Animated: ', `\`\`\`${emoji.animated}\`\`\``, false)
                  .setTimestamp();
  
              var sChannel = emoji.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildAfkChannelAdd", (guild, afkChannel) => {
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(guild.name, guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **AFK Channel Changed!**')
                  .addField('AFK Channel:', afkChannel, false)
                  .setThumbnail(guild.iconURL())
                  .setTimestamp();
  
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildVanityURLAdd", (guild, vanityURL) => {
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(guild.name, guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Vanity URL Setted!**')
                  .addField('Vanity URL:', vanityURL, false)
                  .setThumbnail(guild.iconURL())
                  .setTimestamp();
  
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildBanAdd", function(guild, user){
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(guild.name, guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **User got banned!**')
                  .addField('Username:', `\`\`\`${user.username}\`\`\``, true)
                  .addField('Discriminator:', `\`\`\`${user.discriminator}\`\`\``, true)
                  .addField('ID:', `\`\`\`${user.id}\`\`\``, false)
                  .addField('Created At:', `\`\`\`${user.createdAt.toLocaleDateString()}\`\`\``, false)
                  .setThumbnail(guild.iconURL())
                  .setTimestamp();
  
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildBanRemove", function(guild, user){
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(guild.name, guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **User got unbanned!**')
                  .addField('Username:', `\`\`\`${user.username}\`\`\``, true)
                  .addField('Discriminator:', `\`\`\`${user.discriminator}\`\`\``, true)
                  .addField('ID:', `\`\`\`${user.id}\`\`\``, false)
                  .addField('Created At:', `\`\`\`${user.createdAt.toLocaleDateString()}\`\`\``, false)
                  .setThumbnail(guild.iconURL())
                  .setTimestamp();
  
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildMemberAdd", function(member){
      let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
      let logchannel = db.fetch(`logs_${member.guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(member.guild.name, member.guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **User joins a guild!**')
                  .addField('Username:', `\`\`\`${member.user.username}\`\`\``, true)
                  .addField('Discriminator:', `\`\`\`${member.user.discriminator}\`\`\``, true)
                  .addField('ID:', `\`\`\`${member.user.id}\`\`\``, false)
                  .addField('Created At:', `\`\`\`${member.user.createdAt.toLocaleDateString()}\`\`\``, false)
                  .setThumbnail(member.guild.iconURL())
                  .setTimestamp();
  
              var sChannel = member.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildMemberRemove", function(member){
      let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
      let logchannel = db.fetch(`logs_${member.guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(member.guild.name, member.guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **User leaves a guild, or get kicked!**')
                  .addField('Username:', `\`\`\`${member.user.username}\`\`\``, true)
                  .addField('Discriminator:', `\`\`\`${member.user.discriminator}\`\`\``, true)
                  .addField('ID:', `\`\`\`${member.user.id}\`\`\``, false)
                  .addField('Created At:', `\`\`\`${member.user.createdAt.toLocaleDateString()}\`\`\``, false)
                  .setThumbnail(member.guild.iconURL())
                  .setTimestamp();
  
              var sChannel = member.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("roleCreate", function(role){
      let embedcolor = db.fetch(`logs_embedcolor_${role.guild.id}`);
      let logchannel = db.fetch(`logs_${role.guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(role.guild.name, role.guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Role got created!**')
                  .addField('Name:', `\`\`\`${role.name}\`\`\``, false)
                  .addField('ID:', `\`\`\`${role.id}\`\`\``, false)
                  .addField('Mentionable?: ', `\`\`\`${role.mentionable}\`\`\``, false)
                  .addField('Role Color:', `\`\`\`${role.color}\`\`\``, false)
                  .setThumbnail(role.guild.iconURL())
                  .setTimestamp();
  
              var sChannel = role.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("roleDelete", function(role){
      let embedcolor = db.fetch(`logs_embedcolor_${role.guild.id}`);
      let logchannel = db.fetch(`logs_${role.guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(role.guild.name, role.guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Role got created!**')
                  .addField('Name:', `\`\`\`${role.name}\`\`\``, false)
                  .addField('ID:', `\`\`\`${role.id}\`\`\``, false)
                  .addField('Mentionable?: ', `\`\`\`${role.mentionable}\`\`\``, false)
                  .addField('Role Color:', `\`\`\`${role.color}\`\`\``, false)
                  .setThumbnail(role.guild.iconURL())
                  .setTimestamp();
  
              var sChannel = role.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildVanityURLRemove", (guild, vanityURL) => {
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(guild.name, guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Vanity URL Removed!**')
                  .addField('Vanity URL:', `\`\`\`${vanityURL}\`\`\``, false)
                  .setThumbnail(guild.iconURL())
                  .setTimestamp();
  
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildVanityURLUpdate", (guild, oldVanityURL, newVanityURL) => {
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(guild.name, guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Vanity URL Changed!**')   
                  .addField('OLD Vanity URL:', `\`\`\`${oldVanityURL}\`\`\``, true)
                  .addField('New Vanity URL:', `\`\`\`${newVanityURL}\`\`\``, true)
                  .setThumbnail(guild.iconURL())
                  .setTimestamp();
  
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildFeaturesUpdate", (oldGuild, newGuild) => {
      let embedcolor = db.fetch(`logs_embedcolor_${newGuild.id}`);
      let logchannel = db.fetch(`logs_${newGuild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(newGuild.name, newGuild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Guild get new features!**')   
                  .addField('New Features:', `\`\`\`${newGuild.features.join(", ")}\`\`\``, true)
                  .setThumbnail(newGuild.iconURL())
                  .setTimestamp();
  
              var sChannel = newGuild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildAcronymUpdate", (oldGuild, newGuild) => {
      let embedcolor = db.fetch(`logs_embedcolor_${newGuild.id}`);
      let logchannel = db.fetch(`logs_${newGuild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(newGuild.name, newGuild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Acronym Updated !**')   
                  .addField('New Acronym:', `\`\`\`${newGuild.nameAcronym}\`\`\``, true)
                  .setThumbnail(newGuild.iconURL())
                  .setTimestamp();
  
              var sChannel = newGuild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildOwnerUpdate", (oldGuild, newGuild) => {
      let embedcolor = db.fetch(`logs_embedcolor_${newGuild.id}`);
      let logchannel = db.fetch(`logs_${newGuild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(newGuild.name, newGuild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Guild Owner Updated !**')   
                  .addField('Old Guild Owner:', `<@${oldGuild.owner.id}>`, true)
                  .addField('New Guild Owner:', `<@${newGuild.owner.id}>`, true)
                  .setThumbnail(newGuild.iconURL())
                  .setTimestamp();
  
              var sChannel = newGuild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildPartnerAdd", (guild) => {
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(guild.name, guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Guild got Partnered!**')   
                  .setThumbnail(guild.iconURL())
                  .setTimestamp();
  
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildPartnerRemove", (guild) => {
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(guild.name, guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Guild is no longer Partnered!**')   
                  .setThumbnail(guild.iconURL())
                  .setTimestamp();
  
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildVerificationAdd", (guild) => {
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(guild.name, guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Guild got Verified!**')   
                  .setThumbnail(guild.iconURL())
                  .setTimestamp();
  
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("guildVerificationRemove", (guild) => {
      let embedcolor = db.fetch(`logs_embedcolor_${guild.id}`);
      let logchannel = db.fetch(`logs_${guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(guild.name, guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Guild is no longer Verified!**')   
                  .setThumbnail(guild.iconURL())
                  .setTimestamp();
  
              var sChannel = guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("messagePinned", (message) => {
      let embedcolor = db.fetch(`logs_embedcolor_${message.guild.id}`);
      let logchannel = db.fetch(`logs_${message.guild.id}`);
              if (!logchannel) return;
  
              const embed = new Discord.MessageEmbed()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **The message has been pinned!**')
                  .addField('Content:', message, true)
                  .addField('Channel:', `<#${message.channel.id}>`, true) 
                  .addField('Message sent by:', message.author, true)  
                  .setThumbnail(message.guild.iconURL())
                  .setTimestamp();
  
              var sChannel = message.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("messageContentEdited", (message, oldContent, newContent) => {
      let embedcolor = db.fetch(`logs_embedcolor_${message.guild.id}`);
      let logchannel = db.fetch(`logs_${message.guild.id}`);
              if (!logchannel) return;

              const embed = new Discord.MessageEmbed()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **The message has been updated!**')
                  .addField('Message sent by:', message.author, true) 
                  .addField('Message sent in:', `<#${message.channel.id}>`, true)
                  .addField('\u200B', '\u200B', false)
                  .addField('Old Message:', oldContent, true)
                  .addField('New Message:', newContent, true)  
                  .setThumbnail(message.guild.iconURL())
                  .setTimestamp();
  
              var sChannel = message.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("messageDelete", function(message){
      let embedcolor = db.fetch(`logs_embedcolor_${message.guild.id}`);
      let logchannel = db.fetch(`logs_${message.guild.id}`);
              if (!logchannel) return;
            if(message.attachments.first()) {
              const embed = new Discord.MessageEmbed()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **The message has been deleted!**')
                  .addField('Message sent by:', message.author, true) 
                  .addField('Message sent in:', `<#${message.channel.id}>`, true)
                  .setImage(message.attachments.first().proxyURL)
                  .setTimestamp();

                  var sChannel = message.guild.channels.cache.get(logchannel)
                  if (!sChannel) return;
                  sChannel.send(embed)
            } else {
                  const embed = new Discord.MessageEmbed()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **The message has been deleted!**')
                  .addField('Message sent by:', message.author, true) 
                  .addField('Message sent in:', `<#${message.channel.id}>`, true)
                  .addField('Message Content:', message.content || `I can't get message data (It was embed)`, false)
                  .setTimestamp();

                  var s1Channel = message.guild.channels.cache.get(logchannel)
                  if (!s1Channel) return;
                  s1Channel.send(embed)
            }
});

client.on("rolePositionUpdate", (role, oldPosition, newPosition) => {
      let embedcolor = db.fetch(`logs_embedcolor_${role.guild.id}`);
      let logchannel = db.fetch(`logs_${role.guild.id}`);
              if (!logchannel) return;

              const embed = new Discord.MessageEmbed()
                  .setAuthor(role.guild.name, role.guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription('⚒️ **Role Position Updated!**')
                  .addField('Role:', `\`\`\`${role.name}\`\`\``, true) 
                  .addField('Old position:', `\`\`\`${oldPosition}\`\`\``, true)
                  .addField('New position:', `\`\`\`${newPosition}\`\`\``, true)
                  .setThumbnail(role.guild.iconURL())
                  .setTimestamp();
  
              var sChannel = role.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("rolePermissionsUpdate", (role, oldPermissions, newPermissions) => {
      let embedcolor = db.fetch(`logs_embedcolor_${role.guild.id}`);
      let logchannel = db.fetch(`logs_${role.guild.id}`);
              if (!logchannel) return;

              const embed = new Discord.MessageEmbed()
                  .setAuthor(role.guild.name, role.guild.iconURL())
                  .setColor(embedcolor || 'BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription(`⚒️ **Permisions Updated for Role ${role}!**`)
                  .setThumbnail(role.guild.iconURL())
                  .setTimestamp(); 
  
              var sChannel = role.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("voiceChannelJoin", (member, channel) => {
      let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
      let logchannel = db.fetch(`vclog_${member.guild.id}`)
              if (!logchannel) return;
    
              const embed = new Discord.MessageEmbed()
                    .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({dynamic:true}))
                    .setColor(embedcolor || 'BLACK')
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setDescription(`${client.emotes.voice} <@${member.user.id}> **joined <#${channel.id}>.**`)
                    .setThumbnail(member.user.avatarURL({dynamic:true}))
                    .setTimestamp();
    
              var sChannel = member.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("voiceChannelLeave", (member, channel) => {
      let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
      let logchannel = db.fetch(`vclog_${member.guild.id}`)
              if (!logchannel) return;
    
              const embed = new Discord.MessageEmbed()
                    .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({dynamic:true}))
                    .setColor(embedcolor || 'BLACK')
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setDescription(`${client.emotes.voice} <@${member.user.id}> **left <#${channel.id}>.**`)
                    .setThumbnail(member.user.avatarURL({dynamic:true}))
                    .setTimestamp();
    
              var sChannel = member.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("voiceChannelSwitch", (member, oldChannel, newChannel) => {
      let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
      let logchannel = db.fetch(`vclog_${member.guild.id}`)
              if (!logchannel) return;
    
              const embed = new Discord.MessageEmbed()
                    .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({dynamic:true}))
                    .setColor(embedcolor || 'BLACK')
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setDescription(`${client.emotes.voice} <@${member.user.id}> **changed voice channel.**`)
                    .addField(`Old channel: `, `\`\`\`${oldChannel.name}\`\`\``, true)
                    .addField(`New channel: `, `\`\`\`${newChannel.name}\`\`\``, true)
                    .setThumbnail(member.user.avatarURL({dynamic:true}))
                    .setTimestamp();
    
              var sChannel = member.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("voiceChannelMute", (member, muteType) => {
      let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
      let logchannel = db.fetch(`vclog_${member.guild.id}`)
              if (!logchannel) return;
    
              const embed = new Discord.MessageEmbed()
                    .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({dynamic:true}))
                    .setColor(embedcolor || 'BLACK')
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setDescription(`${client.emotes.voice} <@${member.user.id}> **become muted! (type: ${muteType})**`)
                    .setThumbnail(member.user.avatarURL({dynamic:true}))
                    .setTimestamp();
    
              var sChannel = member.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("voiceChannelUnmute", (member, oldMuteType) => {
      let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
      let logchannel = db.fetch(`vclog_${member.guild.id}`)
              if (!logchannel) return;
    
              const embed = new Discord.MessageEmbed()
                    .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({dynamic:true}))
                    .setColor(embedcolor || 'BLACK')
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setDescription(`${client.emotes.voice} <@${member.user.id}> **become unmuted! **`)
                    .setThumbnail(member.user.avatarURL({dynamic:true}))
                    .setTimestamp();
    
              var sChannel = member.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("voiceChannelDeaf", (member, deafType) => {
      let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
      let logchannel = db.fetch(`vclog_${member.guild.id}`)
              if (!logchannel) return;
    
              const embed = new Discord.MessageEmbed()
                    .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({dynamic:true}))
                    .setColor(embedcolor || 'BLACK')
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setDescription(`${client.emotes.voice} <@${member.user.id}> **become deaf! (type: ${deafType})**`)
                    .setThumbnail(member.user.avatarURL({dynamic:true}))
                    .setTimestamp();
    
              var sChannel = member.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("voiceChannelUndeaf", (member, deafType) => {
      let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
      let logchannel = db.fetch(`vclog_${member.guild.id}`)
              if (!logchannel) return;
    
              const embed = new Discord.MessageEmbed()
                    .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({dynamic:true}))
                    .setColor(embedcolor || 'BLACK')
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setDescription(`${client.emotes.voice} <@${member.user.id}> **become undeaf! **`)
                    .setThumbnail(member.user.avatarURL({dynamic:true}))
                    .setTimestamp();
    
              var sChannel = member.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("voiceStreamingStart", (member, voiceChannel) => {
      let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
      let logchannel = db.fetch(`vclog_${member.guild.id}`)
              if (!logchannel) return;
    
              const embed = new Discord.MessageEmbed()
                    .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({dynamic:true}))
                    .setColor(embedcolor || 'BLACK')
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setDescription(`${client.emotes.voice} <@${member.user.id}> **started streaming in ${voiceChannel.name}! **`)
                    .setThumbnail(member.user.avatarURL({dynamic:true}))
                    .setTimestamp();
    
              var sChannel = member.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});

client.on("voiceStreamingStop", (member, voiceChannel) => {
      let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
      let logchannel = db.fetch(`vclog_${member.guild.id}`)
              if (!logchannel) return;
    
              const embed = new Discord.MessageEmbed()
                    .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({dynamic:true}))
                    .setColor(embedcolor || 'BLACK')
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setDescription(`${client.emotes.voice} <@${member.user.id}> **stopped streaming! **`)
                    .setThumbnail(member.user.avatarURL({dynamic:true}))
                    .setTimestamp();
    
              var sChannel = member.guild.channels.cache.get(logchannel)
              if (!sChannel) return;
              sChannel.send(embed)
});




//ANTI SAFTY

client.on("roleCreate", async role => {
  if (role.managed === true) return;
  const log = await role.guild.fetchAuditLogs({
        type: 'ROLE_CREATE'
    }).then(audit => audit.entries.first())
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = db.get(`whitelist_${role.guild.id}`)
    if(whitelist && whitelist.find(x => x.user === user.id)) {
    return;
    }
    let person = db.get(`${role.guild.id}_${user.id}_rolecreate`)
    let limit = db.get(`rolecreate_${role.guild.id}`)
    if (limit === null) {
      return;
    }
    let logsID = db.get(`logs_${role.guild.id}`)
    let punish = db.get(`punish_${role.guild.id}`)
    let logs = client.channels.cache.get(logsID)
    if(person > limit - 1) {
      if (punish === "ban") {
        role.guild.members.ban(user.id).then(bruhmoment => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role create limits")
          .addField("Punishment", punish)
          .addField("Banned", "Yes")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role create limits")
          .addField("Punishment", punish)
          .addField("Banned", "No")
          .setColor("#FF0000")
          if (logs) {
            return logs.send({ embed: embed })
          }
        })
      } else if (punish === "kick") {
        role.guild.members.cache.get(user.id).kick().then(bruhlol => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role create limits")
          .addField("Punishment", punish)
          .addField("kicked", "Yes")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role create limits")
          .addField("Punishment", punish)
          .addField("kicked", "No")
          .setColor("#FF0000")
          if (logs) {
            return logs.send({ embed: embed })
          }
        })
      } else if (punish === "demote") {
        role.guild.members.cache.get(user.id).roles.cache.forEach(r => {
          if (r.name !== "@everyone") {
            role.guild.members.cache.get(user.id).roles.remove(r.id)
          }
        }).then(bruhlolxd => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role create limits")
          .addField("Punishment", punish)
          .addField("demoted", "Yes")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "Tried to Raid | Breaking role create limits")
          .addField("Punishment", punish)
          .addField("demoted", "No")
          if (logs) {
            return logs.send({ embed: embed })
          }
        })
      }
    } else {
      db.add(`${role.guild.id}_${user.id}_rolecreate`, 1)
       let pog = db.get(`${role.guild.id}_${user.id}_rolecreate`)
       let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Creating Roles...")
          .addField("Punishment", punish)
          .addField("Times", `${pog || 0}/${limit || 0}`)
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
    }
    }
});

client.on("roleDelete", async role => {
  if (role.managed === true) return;
  const log = await role.guild.fetchAuditLogs({
        type: 'ROLE_DELETE'
    }).then(audit => audit.entries.first())
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = db.get(`whitelist_${role.guild.id}`)
    if(whitelist && whitelist.find(x => x.user === user.id)) {
    return;
    }
    let person = db.get(`${role.guild.id}_${user.id}_roledelete`)
    let limit = db.get(`roledelete_${role.guild.id}`)
    if (limit === null) {
      return;
    }
    let logsID = db.get(`logs_${role.guild.id}`)
    let punish = db.get(`punish_${role.guild.id}`)
    let logs = client.channels.cache.get(logsID)
    if(person > limit - 1) {
      if (punish === "ban") {
        role.guild.members.ban(user.id).then(xdbruhlol => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role delete limits")
          .addField("Punishment", punish)
          .addField("Banned", "Yes")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role delete limits")
          .addField("Punishment", punish)
          .addField("Banned", "No")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "kick") {
        role.guild.members.cache.get(user.id).kick().then(xdbruhlolmoment => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role delete limits")
          .addField("Punishment", punish)
          .addField("kicked", "Yes")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role delete limits")
          .addField("Punishment", punish)
          .addField("kicked", "No")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "demote") {
        role.guild.members.cache.get(user.id).roles.cache.forEach(r => {
          if (r.name !== "@everyone") {
            role.guild.members.cache.get(user.id).roles.remove(r.id)
          }
        }).then(bruhmomentlolxd => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role delete limits")
          .addField("Punishment", punish)
          .addField("demoted", "Yes")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "Tried to Raid | Breaking role delete limits")
          .addField("Punishment", punish)
          .addField("demoted", "No")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      }
    } else {
      db.add(`${role.guild.id}_${user.id}_roledelete`, 1)
       let pog = db.get(`${role.guild.id}_${user.id}_roledelete`)
       let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Deleting Roles...")
          .addField("Punishment", punish)
          .addField("Times", `${pog || 0}/${limit || 0}`)
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
    }
    }
})

client.on("channelCreate", async channel => {
  const log = await channel.guild.fetchAuditLogs({
        type: 'CHANNEL_CREATE'
    }).then(audit => audit.entries.first())
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = db.get(`whitelist_${channel.guild.id}`)
    if(whitelist && whitelist.find(x => x.user === user.id)) {
    return;
    }
    let person = db.get(`${channel.guild.id}_${user.id}_channelcreate`)
    let limit = db.get(`channelcreate_${channel.guild.id}`)
    if (limit === null) {
      return;
    }
    let logsID = db.get(`logs_${channel.guild.id}`)
    let logs = client.channels.cache.get(logsID)
    let punish = db.get(`punish_${channel.guild.id}`)
    if(person > limit - 1) {
      if (punish === "ban") {
        channel.guild.members.ban(user.id).then(hshshshs => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the channel create limits")
          .addField("Punishment", punish)
          .addField("Banned", "Yes")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the channel create limits")
          .addField("Punishment", punish)
          .addField("Banned", "No")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "kick") {
        channel.guild.members.cache.get(user.id).kick().then(jsisj => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the channel create limits")
          .addField("Punishment", punish)
          .addField("kicked", "Yes")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the channel create limits")
          .addField("Punishment", punish)
          .addField("kicked", "No")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "demote") {
        channel.guild.members.cache.get(user.id).roles.cache.forEach(r => {
          if (r.name !== "@everyone") {
            channel.guild.members.cache.get(user.id).roles.remove(r.id)
          }
        }).then(hrh => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the channel create limits")
          .addField("Punishment", punish)
          .addField("demoted", "Yes")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "Tried to Raid | Breaking channel create limits")
          .addField("Punishment", punish)
          .addField("demoted", "No")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      }
    } else {
      db.add(`${channel.guild.id}_${user.id}_channelcreate`, 1)
       let pog = db.get(`${channel.guild.id}_${user.id}_channelcreate`)
       let bruh = db.get(`channelcreate_${channel.guild.id}`)
       let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Creating channels...")
          .addField("Punishment", punish)
          .addField("Times", `${pog || 0}/${bruh || 0}`)
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
    }
    }
})

client.on("channelDelete", async channel => {
  const log = await channel.guild.fetchAuditLogs({
        type: 'CHANNEL_DELETE'
    }).then(audit => audit.entries.first())
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = db.get(`whitelist_${channel.guild.id}`)
    if(whitelist && whitelist.find(x => x.user === user.id)) {
    return;
    }
    let person = db.get(`${channel.guild.id}_${user.id}_channeldelete`)
    let limit = db.get(`channeldelete_${channel.guild.id}`)
    if (limit === null) {
      return;
    }
    let logsID = db.get(`logs_${channel.guild.id}`)
    let logs = client.channels.cache.get(logsID)
    let punish = db.get(`punish_${channel.guild.id}`)
    if(person > limit - 1) {
      if (punish === "ban") {
        channel.guild.members.ban(user.id).then(hahsh => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the channel delete limits")
          .addField("Punishment", punish)
          .addField("Banned", "Yes")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the channel delete limits")
          .addField("Punishment", punish)
          .addField("Banned", "No")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "kick") {
        channel.guild.members.cache.get(user.id).kick().then(gsy => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the channel delete limits")
          .addField("Punishment", punish)
          .addField("kicked", "Yes")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the channel delete limits")
          .addField("Punishment", punish)
          .addField("kicked", "No")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "demote") {
        channel.guild.members.cache.get(user.id).roles.cache.forEach(r => {
          if (r.name !== "@everyone") {
            channel.guild.members.cache.get(user.id).roles.remove(r.id)
          }
        }).then(lolxd => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the channel delete limits")
          .addField("Punishment", punish)
          .addField("demoted", "Yes")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "Tried to Raid | Breaking channel delete limits")
          .addField("Punishment", punish)
          .addField("demoted", "No")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      }
    } else {
      db.add(`${channel.guild.id}_${user.id}_channeldelete`, 1)
       let pog = db.get(`${channel.guild.id}_${user.id}_channeldelete`)
       let bruh = db.get(`channeldelete_${channel.guild.id}`)
       let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " | made by HYDRA", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Deleting channels...")
          .addField("Punishment", punish)
          .addField("Times", `${pog || 0}/${bruh || 0}`)
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
    }
    }
})

client.on("guildMemberRemove", async member => {
  const log1 = await member.guild.fetchAuditLogs().then(audit => audit.entries.first())
  if (log1.action === "MEMBER_KICK") {
    const log = await member.guild
      .fetchAuditLogs({
        type: "MEMBER_KICK"
        })
        .then(audit => audit.entries.first());
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = db.get(`whitelist_${member.guild.id}`)
    if(whitelist && whitelist.find(x => x.user === user.id)) {
    return;
    }
    let person = db.get(`${member.guild.id}_${user.id}_kicklimit`)
    let limit = db.get(`kicklimit_${member.guild.id}`)
    if (limit === null) {
      return;
    }
    let logsID = db.get(`logs_${member.guild.id}`)
    let punish = db.get(`punish_${member.guild.id}`)
    let logs = client.channels.cache.get(logsID)
    if(person > limit - 1) {
      if (punish === "ban") {
        member.guild.members.ban(user.id).then(lolxdbruh => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the kick limits")
          .addField("Punishment", punish)
          .addField("Banned", "Yes")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the kick limits")
          .addField("Punishment", punish)
          .addField("Banned", "No")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "kick") {
        member.guild.members.cache.get(user.id).kick().then(ehbruh => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the kick limits")
          .addField("Punishment", punish)
          .addField("kicked", "Yes")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the kick limits")
          .addField("Punishment", punish)
          .addField("kicked", "No")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "demote") {
        member.guild.members.cache.get(user.id).roles.cache.forEach(r => {
          if (r.name !== "@everyone") {
            member.guild.members.cache.get(user.id).roles.remove(r.id)
          }
        }).then(lolbutbruh => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the kick limits")
          .addField("Punishment", punish)
          .addField("demoted", "Yes")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "Tried to Raid | Breaking kick limits")
          .addField("Punishment", punish)
          .addField("demoted", "No")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      }
    } else {
      db.add(`${member.guild.id}_${user.id}_kicklimit`, 1)
       let pog = db.get(`${member.guild.id}_${user.id}_kicklimit`)
       let bruh = db.get(`kicklimit_${member.guild.id}`)
       let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "kicking members...")
          .addField("Punishment", punish)
          .addField("Times", `${pog || 0}/${bruh || 0}`)
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
    }
    }
  }
})

client.on("guildBanAdd", async member => {
  
  //let member = guild.members.cache.get(userr.id)
    
  const log1 = await member.guild.fetchAuditLogs().then(audit => audit.entries.first())
  if (log1.action === "MEMBER_BAN_ADD") {
    const log = await member.guild
      .fetchAuditLogs({
        type: "MEMBER_BAN_ADD"
        })
        .then(audit => audit.entries.first());
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = db.get(`whitelist_${member.guild.id}`)
    if(whitelist && whitelist.find(x => x.user === user.id)) {
    return;
    }
    let person = db.get(`${member.guild.id}_${user.id}_banlimit`)
    let limit = db.get(`banlimit_${member.guild.id}`)
    if (limit === null) {
      return;
    }
    let logsID = db.get(`logs_${member.guild.id}`)
    let logs = client.channels.cache.get(logsID)
    let punish = db.get(`punish_${member.guild.id}`)
    if(person > limit - 1) {
      if (punish === "ban") {
        member.guild.members.ban(user.id).then(lolxdbruh => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the ban limits")
          .addField("Punishment", punish)
          .addField("Banned", "Yes")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the ban limits")
          .addField("Punishment", punish)
          .addField("Banned", "No")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "kick") {
        member.guild.members.cache.get(user.id).kick().then(lolxdok => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the ban limits")
          .addField("Punishment", punish)
          .addField("kicked", "Yes")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the ban limits")
          .addField("Punishment", punish)
          .addField("kicked", "No")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "demote") {
        member.guild.members.cache.get(user.id).roles.cache.forEach(r => {
          if (r.name !== "@everyone") {
            member.guild.members.cache.get(user.id).roles.remove(r.id)
          }
        }).then(ok => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the ban limits")
          .addField("Punishment", punish)
          .addField("demoted", "Yes")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "Tried to Raid | Breaking ban limits")
          .addField("Punishment", punish)
          .addField("demoted", "No")
          if (logs) {
            logs.send({ embed: embed })
          }
        }
         )
      }
    } else {
      db.add(`${member.guild.id}_${user.id}_banlimit`, 1)
       let pog = db.get(`${member.guild.id}_${user.id}_banlimit`)
       let bruh = db.get(`banlimit_${member.guild.id}`)
       let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + " | made by HYDRA", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "banning members...")
          .addField("Punishment", punish)
          .addField("Times", `${pog || 0}/${bruh || 0}`)
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
    }
    }
}
})
client.on("roleDelete", async role => {
  if (role.managed === true) return;
  const log = await role.guild.fetchAuditLogs({
        type: 'ROLE_DELETE'
    }).then(audit => audit.entries.first())
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = db.get(`whitelist_${role.guild.id}`)
    if(whitelist && whitelist.find(x => x.user === user.id)) {
    return;
    }
    let person = db.get(`${role.guild.id}_${user.id}_roledelete`)
    let limit = db.get(`roledelete_${role.guild.id}`)
    if (limit === null) {
      return;
    }
    let logsID = db.get(`logs_${role.guild.id}`)
    let punish = db.get(`punish_${role.guild.id}`)
    let logs = client.channels.cache.get(logsID)
    if(person > limit - 1) {
      if (punish === "ban") {
        role.guild.members.ban(user.id).then(xdbruhlol => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " | made by HYDRA", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role delete limits")
          .addField("Punishment", punish)
          .addField("Banned", "Yes")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name, role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role delete limits")
          .addField("Punishment", punish)
          .addField("Banned", "No")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "kick") {
        role.guild.members.cache.get(user.id).kick().then(xdbruhlolmoment => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name, role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the webhook limits")
          .addField("Punishment", punish)
          .addField("kicked", "Yes")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name, role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role delete limits")
          .addField("Punishment", punish)
          .addField("kicked", "No")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "demote") {
        role.guild.members.cache.get(user.id).roles.cache.forEach(r => {
          if (r.name !== "@everyone") {
            role.guild.members.cache.get(user.id).roles.remove(r.id)
          }
        }).then(bruhmomentlolxd => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name, role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the role delete limits")
          .addField("Punishment", punish)
          .addField("demoted", "Yes")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name, role.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "Tried to Raid | Breaking role delete limits")
          .addField("Punishment", punish)
          .addField("demoted", "No")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      }
    } else {
      db.add(`${role.guild.id}_${user.id}_roledelete`, 1)
       let pog = db.get(`${role.guild.id}_${user.id}_roledelete`)
       let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name, role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Deleting Roles...")
          .addField("Punishment", punish)
          .addField("Times", `${pog || 0}/${limit || 0}`)
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
    }
    }
})



client.on("guildMemberRemove", async member => {
  let user = member.user
    let stuff = [`${member.guild.id}_${user.id}_rolecreate`, `${member.guild.id}_${user.id}_roledelete`, `${member.guild.id}_${user.id}_channelcreate`, `${member.guild.id}_${user.id}_channeldelete`, `${member.guild.id}_${user.id}_banlimit`, `${member.guild.id}_${user.id}_kicklimit`]
    stuff.forEach(bruh => db.delete(bruh))
})

client.login(token).catch(err => {
	console.log('[ERROR]: Invalid Token Provided');
});


client.on("message", async (message) => {
  if (message.author.bot) return;
  let words = db.get(`words_${message.guild.id}`)
  let yus = db.get(`message_${message.guild.id}`)
  if (yus === null) {
    yus = ":x: | **{user-mention}, The Word You said is blacklisted!**"
  }
  if (message.content.startsWith(prefix + "addword")) return;
    if (message.content.startsWith(prefix + "delword")) return;
      if (message.content.startsWith(prefix + "set-warn-msg")) return;
        if (message.content.startsWith(prefix + "words")) return;
  let pog = yus.split("{user-mention}").join("<@"+message.author.id+">").split("{server-name}").join(message.guild.name).split("{user-tag}").join(message.author.tag).split("{user-username}").join(message.author.username)
  if (words === null) return;
  function check(msg) { //is supposed to check if message includes da swear word
    return words.some(word => message.content.toLowerCase().split(" ").join("").includes(word.word.toLowerCase()))
  }
  if (check(message.content) === true) {
    message.delete()
    message.channel.send(pog)
  }
})


//GONNA USE EVENT HERE

const emotfe = require('./emojis.json')

  client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();
    if(user.bot) return;
     let emote = await db.get(`emoteid_${reaction.message.guild.id}_${reaction.emoji.id}`)
    if(!emote) return;
    let messageid = await db.get(`message_${reaction.message.guild.id}_${reaction.emoji.id}`)
    if(!messageid) return;
    let role = await db.get(`role_${reaction.message.guild.id}_${reaction.emoji.id}`)
    if(!role) return;
  
    if(reaction.message.id == messageid && reaction.emoji.id == `${emote}`) {
    reaction.message.guild.members.fetch(user).then(member => {
      let embed = new Discord.MessageEmbed()
      .setAuthor(user.username , user.displayAvatarURL())
      .setDescription(`<:attention:756126867949617253> **It's Looks You Already Have ${reaction.message.guild.roles.cache.get(role).name}** `)
      .setFooter(reaction.message.guild.name , reaction.message.guild.iconURL())
      .setTimestamp()
      if(member.roles.cache.has(role)) return user.send(embed)
      let sucsses = new Discord.MessageEmbed()
      .setAuthor(user.username, user.displayAvatarURL())
      .setDescription(`${emotfe.loading} **${reaction.message.guild.roles.cache.get(role).name}** Has Been added to you on ${reaction.message.guild.name}`)
      .setFooter(reaction.message.guild.name , reaction.message.guild.iconURL())
      .setTimestamp()
  
      member.roles.add(role) 
      return user.send(sucsses)
    })
    }
  })
   
client.on('messageReactionAdd', async (reaction, user) => {
  if(user.partial) await user.fetch();
  if(reaction.partial) await reaction.fetch();
  if(reaction.message.partial) await reaction.message.fetch();
  if(user.bot) return;
   let emote = await db.get(`emoteid_${reaction.message.guild.id}_${reaction.emoji.name}`)
  if(!emote) return;
  let messageid = await db.get(`message_${reaction.message.guild.id}_${reaction.emoji.name}`)
  if(!messageid) return;
  let role = await db.get(`role_${reaction.message.guild.id}_${reaction.emoji.name}`)
  if(!role) return;

  if(reaction.message.id == messageid && reaction.emoji.name == `${emote}`) {
  reaction.message.guild.members.fetch(user).then(member => {
    let embed = new Discord.MessageEmbed()
    .setAuthor(user.username , user.displayAvatarURL())
    .setDescription(`<:attention:756126867949617253> **It's Looks You Already Have ${reaction.message.guild.roles.cache.get(role).name}** `)
    .setFooter(reaction.message.guild.name , reaction.message.guild.iconURL())
    .setTimestamp()
    if(member.roles.cache.has(role)) return user.send(embed)
    let sucsses = new Discord.MessageEmbed()
    .setAuthor(user.username, user.displayAvatarURL())
    .setDescription(`${emotfe.loading} **${reaction.message.guild.roles.cache.get(role).name}** Has Been added to you on ${reaction.message.guild.name}`)
    .setFooter(reaction.message.guild.name , reaction.message.guild.iconURL())
    .setTimestamp()

    member.roles.add(role) 
    return user.send(sucsses)
  })
  }
})
 
 
  client.on('messageReactionRemove', async (reaction, user) => {
  console.log(user.username)
  if(user.partial) await user.fetch();
  if(reaction.partial) await reaction.fetch();
  if(reaction.message.partial) await reaction.message.fetch();
  if(user.bot) return;
  let emote = await db.get(`emoteid_${reaction.message.guild.id}_${reaction.emoji.id}`)
  if(!emote) return;
  let messageid = await db.get(`message_${reaction.message.guild.id}_${reaction.emoji.id}`)
  if(!messageid) return;
  let role = await db.get(`role_${reaction.message.guild.id}_${reaction.emoji.id}`)
  if(!role) return;
   if(reaction.message.id == messageid && reaction.emoji.id == `${emote}`) {
    reaction.message.guild.members.fetch(user).then(member => {

   let embed = new Discord.MessageEmbed()
   .setAuthor(user.username , user.displayAvatarURL())
   .setDescription(`${emotfe.attention} **${reaction.message.guild.roles.cache.get(role).name}** Role Removed From You!`)
   .setFooter(reaction.message.guild.name , reaction.message.guild.iconURL())
   .setTimestamp()
   user.send(embed)
   member.roles.remove(role)
    
  })
  }
})

client.on('messageReactionRemove', async (reaction, user) => {
  console.log(user.username)
  if(user.partial) await user.fetch();
  if(reaction.partial) await reaction.fetch();
  if(reaction.message.partial) await reaction.message.fetch();
  if(user.bot) return;
  let emote = await db.get(`emoteid_${reaction.message.guild.id}_${reaction.emoji.name}`)
  if(!emote) return;
  let messageid = await db.get(`message_${reaction.message.guild.id}_${reaction.emoji.name}`)
  if(!messageid) return;
  let role = await db.get(`role_${reaction.message.guild.id}_${reaction.emoji.name}`)
  if(!role) return;
   if(reaction.message.id == messageid && reaction.emoji.name == `${emote}`) {
    reaction.message.guild.members.fetch(user).then(member => {
    
   let embed = new Discord.MessageEmbed()
   .setAuthor(user.username , user.displayAvatarURL())
   .setDescription(`${emotfe.attention} **${reaction.message.guild.roles.cache.get(role).name}** Role Removed From You!`)
   .setFooter(reaction.message.guild.name , reaction.message.guild.iconURL())
   .setTimestamp()
   user.send(embed)
   member.roles.remove(role)
    
  })
  }
})


client.login(process.env.TOKEN);