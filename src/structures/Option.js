const Base = require('./Base.js');
const hasCapitalLetter = require('../util/hasCapitalLetter.js');

class Option extends Base {
    constructor() {
        super();
    }
    setName(name) {
      if (!name || typeof name !== "string") throw new Error("Option Name must be A string");
      if (hasCapitalLetter(name)) throw new Error("option name can contain uppercases");
      this._patch(this, "name", name);
      return this;
    };

    setRequired() {
        this._patch(this, "required", true);
        return this;
    };
}

module.exports = Option;