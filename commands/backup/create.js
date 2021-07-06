const backup = require("discord-backup")

module.exports = {
  name: "create-backup",
  
  run: async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send(":x: | You must be an administrator of this server to request a backup!");
        }
        // Create the backup
        backup.create(message.guild, {
            maxMessagesPerChannel: 0,
            jsonBeautify: true
        }).then((backupData) => {
            // And send informations to the backup owner
            message.author.send("The backup has been created! To load it, type this command on the server of your choice: +load `"+backupData.id+"`!");
            message.channel.send(":white_check_mark: Backup successfully created. The backup ID was sent in dm!");
        });
    }
  }