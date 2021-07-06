const backup = require("discord-backup");
const MessageEmbed = require("discord.js")

module.exports = {
  name: "list-backup",
  run: async ( client, message, args) => {
backup.list().then((backups) => {
    message.channel.send(new MessageEmbed()
                        .setDescription(backups)
                        .setTitle("Your backup list")
                         .setColor(`RANDOM`)
                        ); // Expected Output [ "BC5qo", "Jdo91", ...]
})
}
}