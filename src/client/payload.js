
module.exports = (client) => {
    const payload = {
        token: client.token,
        intents: client.options.intents.bitfield,
        properties: { $os: 'linux', $browser: 'chrome', $device: 'chrome' },
    }

    return payload
}