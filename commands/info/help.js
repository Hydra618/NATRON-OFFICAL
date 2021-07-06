const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
  name: "help",
  
  run: async (client, message, args) => {
    
       if (args[0]) {
      const command = await client.commands.get(args[0]);

      if (!command) {
        return message.channel.send("Unknown Command: " + args[0]);
      }

      let embed = new Discord.MessageEmbed()
        .setAuthor(command.name, client.user.displayAvatarURL())
        .addField("❯ Description", command.description || "Not Provided :(")
        .addField("❯ Usage", "`" + command.usage + "`" || "Not Provied")
        .setThumbnail(client.user.displayAvatarURL())
        .setColor("BLUE")
        .setFooter(client.user.username, client.user.displayAvatarURL());

      return message.channel.send(embed);
    } else { 
      const prefix = `+`
    
    let hembed = new Discord.MessageEmbed()
    .setTitle(`**<a:greenfly:840803348340015114> HELP MENU <a:greenfly:840803348340015114>**`)
    .setDescription("This is the help module of Natron || It is useful in many ways")
    .addField("CURRENT PREFIX IS", prefix)
    .addField("<a:gconfig:840803360256032790> CONFIGURATION ", `\`setmodlogchannel, disablemodlogchannel, disablemuterole, setmuterole, setserverlogs, setnicklogs, setvcrole, setautorole\``)
    .addField("<a:gsecurity:840803356188213298> SERVER SECURITY", `\`config, whitelist, delwhitelist, whitelisted, set-anti-alt\``)
    .addField("<:backup:840803366413533205> BACKUP ", `\`create-backup, load-backup, info-backup, list-backup\``)
    .addField("<a:upn:840803355236106310> MISCELLANEOUS", `\`avatar, invite, stats, ping, uptime, embed, announce, stealemoji\``)
    .addField("<a:info5:840813674796417075> INFORMATION", `\`serverinfo, userinfo, owner, help, botinfo, playstore, roleinfo, channelinfo\``)
    .addField("<a:gfun:840803363380920330> FUN", `\`kiss, hug, slap, poke, pat, smug, clyde, emojify, tictactoe, blink, delete, blur, criminal, jail, wanted, spank\``)
    .addField("<a:gmod:840803348780548127> MODERATION ", `\`dm, deafen, ban, kick, mute, hackban, lock, lockdown, unlock, purge, undeafen, vcmove, slowmode, unban, \``) 
    .addField("<:groles:840803345819762709> ROLE SYSTEM", `\`roleadd, roledel, addroleall, removeroleall, rradd, rrdelete\``) 
    .addField("<a:gwelcome:840803349569601547> WELCOME", `\`welcome\``) 
    .addField("<a:gcd:840803348932067369> MUSIC SYSTEM ", `\`play, stop, pause, resume, skip, filter, loop, nowplaying, clearqueue, queue, shuffle, w-filters\``) 
    .addField("<:links:840899711510249512> LINKS", "**[INVITE](https://discord.com/api/oauth2/authorize?client_id=836464599087185950&permissions=8&scope=bot)** , **[SUPPORT](https://discord.gg/Jaq6euaWM2)**")
    .setImage("https://cdn.discordapp.com/attachments/840803349540241428/840948843490312202/standard.gif")
    
    message.channel.send(hembed)
    }
}
}