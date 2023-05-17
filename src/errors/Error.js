function HandlerError(message, type = "InvalidType") {
    Error.call(this, message);

    this.message = message;
    this.type = type;

    Error.captureStackTrace(this, this.constructor);
};

HandlerError.prototype = Object.create(Error.prototype);
HandlerError.prototype.constructor = HandlerError;
HandlerError.prototype.name = 'HandlerError';

module.exports = HandlerError;