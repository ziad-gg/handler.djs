const Base = require('./Base');

class EventBuilder extends Base {
    constructor() {
        super();
        this.once = false
    };

    setEvent(name) {
        if (typeof name !== "string") throw new Error("Event name must be an string");
        if (name.toLocaleLowerCase() === 'ready') {
            this._patch(this, "name", "clientReady");
            return this;
        }
        this._patch(this, "name", name);
        return this
    };

    setExecution(func) {
        if (typeof func !== "function") throw new Error("Event call back must be a function");
        this._patch(this, "run", func);
        return this;
    };

    once(value) {
        if (typeof value !== "boolean") throw new Error("event once function takes only boolean");
        this._patch(this, "once", value);
        return this;
    };

    setCustomIds() {

    };

};

module.exports = EventBuilder