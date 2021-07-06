const db = require("quick.db")
const Discord = require("discord.js")
const defaultPrefix = require("../config.json")
const config = require("../config.js")
let moment = require("moment")

module.exports.run = async (client, member) => {
let { guild, user } = member;
	let prefix = db.get(`prefix_${member.guild.id}`) || defaultPrefix;
	let bypassed = db.get(`bypass_${guild.id}`) || [];
	if (bypassed.includes(user.id)) return;
	let warningChan = member.guild.channels.cache.get(
		db.get(`warningchannel_${member.guild.id}`)
	);
	let logsChan = member.guild.channels.cache.get(
		db.get(`verifylogs_${member.guild.id}`)
	);

	let embed = new Discord.MessageEmbed()
		.setTitle(`Verification Logs`)
		.setDescription(`Member Joined`)
		.setFooter(member.guild.name, member.guild.iconURL())
		.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
		.addField(`Member`, `<@${member.user.id}> (${member.user.id})`)
		.addField(
			`Account Age`,
			`Created ${moment(member.user.createdAt).fromNow()}`
		)
		.setColor(
			`${
				Date.now() - member.user.createdAt < 60000 * 60 * 24 * 7
					? '#FF0000'
					: '#00FF00'
			}`
		); //sets the color to red if the account age is less then a week else it sets it to green
	logsChan.send({ embed: embed }).catch(err => {});
	member.user
		.send(
			`Hello ${member.user.username},
Welcome to ${member.guild.name}. This server is protected by ${
				client.user.username
			}. To verify your account, please visit https://${
				config.website.domain
			}/verify/${member.guild.id}\nYou have 15 minutes to complete verification!
With kind regards, the ${member.guild.name} staff team.`
		)
		.catch(err => {
			warningChan.send(
				`Hi <@${
					member.user.id
				}>, it looks like your DM (s) are disabled, please enable them and use the \`${prefix}verify\` command`
			);
		});
	warningChan
		.send(
			`Hi <@${
				member.user.id
			}>, to participate in this server, you must verify your account. Please read the DM I sent to you carefully. You have 15 minutes to complete verification!`
		)
		.catch(err => {});
	//totally didnt steal these messages from AltDentifier
	setTimeout(function() {
		if (!member) return;
		if (db.get(`verified_${guild.id}_${user.id}`) || false) {
			return;
		} else {
			let kicked = true;
			member.user
				.send('You have been kicked from the server for not responding!')
				.catch(err => {});
			member.kick().catch(err => {
				kicked = false;
			});
			let embed = new Discord.MessageEmbed()
				.setTitle(`Verification Logs`)
				.setDescription(`Member kicked`)
				.setFooter(member.guild.name, member.guild.iconURL())
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.addField(`Member`, `<@${member.user.id}> (${member.user.id})`)
				.addField('Reason', 'Member did not respond')
				.setColor('#00FF00');

			let embed2 = new Discord.MessageEmbed()
				.setTitle(`Verification Logs`)
				.setDescription(`Failed to kick member`)
				.setFooter(member.guild.name, member.guild.iconURL())
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.addField(`Member`, `<@${member.user.id}> (${member.user.id})`)
				.addField('Reason', 'Member did not respond')
				.setColor('#FF0000');
			if (kicked) return logsChan.send({ embed: embed });
			else return logsChan.send({ embed: embed2 });
		}
	}, 60000 * 15);
}