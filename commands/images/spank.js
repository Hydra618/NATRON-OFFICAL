const Discord = require('discord.js');
const config = require('../../config.json');
const DIG = require("discord-image-generation");

module.exports = {
    name: "spank",
    category: "Image",
    description: "Posts you spanking the mentioned user",
    example: `${config.Prefix}slap @Dinav`,

    run: async (client, message, args) => {

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        if(!user)
        return message.reply(` Provide a valid user !!`)

        const avatar = user.user.displayAvatarURL({ dynamic: false, format: 'png', size: 1024 });

        new DIG.Spank().getImage(message.member.user.displayAvatarURL({dynamic: false, format: 'png', size: 1024}), avatar);

        let img = await new DIG.Spank().getImage(message.member.user.displayAvatarURL({dynamic: false, format: 'png', size: 1024}), avatar);

        let attach = new Discord.MessageAttachment(img, "spank.png");

        message.channel.send(attach)
    }
}