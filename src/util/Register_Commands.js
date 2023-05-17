module.exports = async function (Application, cmds) {
    if (!cmds || cmds.lenght === 0) return
    const data = await Application.REST_API.REST.put(Application.REST_API.Routes.applicationCommands(Application.client.user.id), { body: cmds });
    return data;
};