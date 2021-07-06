module.exports = {
          name: "slowmode",
          description: "Set the slowmode for the channel!",
          aliases: ['sm'],
          category: "moderation",
  run: async (bot, message, args) => {
  
    if (!args[0])
      return message.channel.send(
        `You did not specify the time in seconds you wish to set this channel's slow mode too!`
      );
      
    if (isNaN(args[0])) return message.channel.send(`That is not a number!`);
    
    message.channel.setRateLimitPerUser(args[0]);
    message.channel.send(
      `Set the slowmode of this channel to **${args[0]}**`
    );
  },
};