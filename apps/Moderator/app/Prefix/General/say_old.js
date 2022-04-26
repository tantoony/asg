const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
class Say extends Command {

    constructor(client) {
        super(client, {
            name: "say2",
            description: "Sunucunun anlık bilgisini verir.",
            usage: "say",
            examples: ["say"],
            category: "Genel",
            accaptedPerms: ["cmd-registry", "cmd-double", "cmd-single", "cmd-ceo"],
            cooldown: 10000,
            enabled: false
        });
    }

    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const roles = await low(client.adapters('roles'));
        await message.reply(new Discord.MessageEmbed().setDescription(stripIndent`
        \`•\` Toplam üye: \`${message.guild.memberCount}\` (${message.guild.members.cache.filter(m => m.presence.status !== 'offline').size} online)
        \`•\` Booster sayısı: \`${message.guild.members.cache.filter(m => m.roles.cache.has(data.roles["booster"])).size}\` (${message.guild.premiumTier}. seviye)
        \`•\` Taglı sayısı: \`${message.guild.members.cache.filter(m => client.config.tags[0].some(tag => m.user.username.includes(tag))).size}\` (${message.guild.members.cache.filter(m => m.roles.cache.has(data.roles["cmd-crew"])).size} yetkili)
        \`•\` Anlık ses: \`${message.guild.voiceStates.cache.filter(v => v.channel).size}\` (${message.guild.voiceStates.cache.filter(v => v.channel && (v.channel.parentId === data.channels["st_public"])).size} public)
        `).setColor('#7bf3e3'));
    }
}

module.exports = Say;