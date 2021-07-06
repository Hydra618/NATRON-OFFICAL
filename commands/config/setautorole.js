const db = require("quick.db")

module.exports = {
    name:"setautorole",
    run: async (client, message, args) => {
        const Discord = require("discord.js");
        if(!message.member.hasPermission("MANAGE_ROLES")) {
            return message.channel.send(`You don't have permission to use that.`)
        }

        let option = args[0]
        if(!option) {
            return message.channel.send(`Please provide an option! (\`on - off\`)`)
        }
        if(
            option.toLowerCase() !== "on" &&
            option.toLowerCase() !== "off"
        )
        {
            return message.channel.send(`ERROR: Invalid second argument.`)
        }

        if(option.toLowerCase() == "on") {
            var role = message.mentions.roles.first()
            if(!role) {
                return message.channel.send(`Please mention a role!`)
            }
            let clientRole = message.guild.me.roles.highest;
            if(role.position > clientRole.position) {
                return message.channel.send(`That role is higher then my highest role! `)
            }
            let autoroleStatus = db.get(`autorole-status_${message.guild.id}`);
            if(autoroleStatus === "on") {
                return message.channel.send(`Autorole is already enabled.`)
            }
            db.set(`autorole-status_${message.guild.id}`, "on");
            db.set(`autorole_${message.guild.id}`, role.id);

            message.channel.send(`Succesfully enabled autorole!`)

        }else {
            if(option.toLowerCase() == "off") {
               
                let autoroleStatus = db.get(`autorole-status_${message.guild.id}`);
                if(autoroleStatus === "off") {
                    return message.channel.send(`Autorole is already disabled.`)
                }
                db.set(`autorole-status_${message.guild.id}`, "off")
                message.channel.send("Succesfully disabled autorole!")
            }
        }
    }
}