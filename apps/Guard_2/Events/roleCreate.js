const { CliEvent } = require('../../../base/utils');
class RoleCreate extends CliEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }

    async run(role) {
        const client = this.client;
        if (role.guild.id !== client.config.server) return;
        const entry = await client.fetchEntry("ROLE_CREATE");
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await client.models.perms.findOne({ user: entry.executor.id, type: "create", effect: "role" });
        if ((permission && (permission.count > 0))) {
            if (permission) await client.models.perms.updateOne({ user: entry.executor.id, type: "create", effect: "role" }, { $inc: { count: -1 } });
            await client.models.bc_role({
                _id: role.id,
                name: role.name,
                color: role.hexColor,
                hoist: role.hoist,
                mentionable: role.mentionable,
                rawPosition: role.rawPosition,
                bitfield: role.permissions.bitfield
            });
            client.handler.emit('Logger', 'Guard', entry.executor.id, "ROLE_CREATE", `${role.name} isimli rolü oluşturdu. Kalan izin sayısı ${permission ? permission.count - 1 : "sınırsız"}`);
            return;
        }
        if (permission) await client.models.perms.deleteOne({ user: entry.executor.id, type: "create", effect: "role" });
        client.handler.emit('Danger', ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        await role.delete();
        const exeMember = role.guild.members.cache.get(entry.executor.id);
        client.handler.emit('Jail', exeMember, client.user.id, "KDE - Rol Oluşturma", "Perma", 0);
        client.handler.emit('Logger', 'KDE', entry.executor.id, "ROLE_CREATE", `${role.name} isimli rolü oluşturdu`);
    }
}

module.exports = RoleCreate;