
const ms = require("ms");

module.exports = {
      name: "mute",
      description: "Mutes a member in the discord!",
      usage: "!mute <user> <reason>",
      category: "moderation",
      accessableby: "Members",
      aliases: ["m", "nospeak"],
  run: async (bot, message, args) => {
// check if the command caller has permission to use the command

if(!message.member.hasPermission("MANAGE_ROLES", "ADMINISTRATOR") || !message.guild.owner) return message.channel.send(":x: **You do not have the permission to use this command!**");

if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send(":x: **I do not have the permission to add roles!**")

//define the reason and mutee

let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

if(!tomute) return message.reply("Couldn't find user.");


let muterole = message.guild.roles.find(`name`, "Muted");
//start of create role
if(!muterole){
  try{
    muterole = await message.guild.createRole({
      name: "Muted",
      color: "#ff0000",
      permissions:[]
    })
    message.guild.channels.cache.each((channel) => { 
   channel.updateOverwrite(muterole, {
            VIEW_CHANNEL: true, 
            SEND_MESSAGES: false,
            READ_MESSAGE_HISTORY: true,
            TALK: false
   });
});
  }catch(e){
    console.log(e.stack);
  }
}
//end of create role
let mutetime = args[1];
if(!mutetime) return message.reply(":X: You didn't specify a time!");

await(tomute.addRole(muterole.id));
message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);
         tomute.send(`Hello, you have been muted in ${message.guild.name} for: **${mutetime}**`).catch(err => console.log(err))

setTimeout(function(){
  tomute.removeRole(muterole.id);
  message.channel.send(`<@${tomute.id}> is no longer muted! Welcome Back!!`);
}, ms(mutetime));
  }
}