const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {

    name: "gayrate",
    category: "Fun",
    description: "Gives the gayrate of the user !!",
    aliases: ["howgay"],
    example: `${config.Prefix}gayrate @Dinav`,

    run: async (client, message, args) => {

        const user =  message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const gayrate = Math.floor(Math.random() * 101)

        if(!user)
        return message.reply(`Provide a valid user from this guild !!`)

        const embed = new Discord.MessageEmbed()
        .setTitle(`<a:Prettygay:840803362123022368> Gayrate !!`)
        .setDescription(`${user} (\`${user.user.tag}\`) is ${gayrate} % gay !!  <a:Prettygay:840803362123022368>`)
        .setTimestamp()

        message.channel.send(embed)
    }
}