function exit(code) {
   process.exit(code);
}


function ExitProcessError(message, code) {
    this.name = 'ExitProcessError';
    this.message = message;
    this.code = code;
}

ExitProcessError.prototype = Error.prototype;

module.exports = {
    exit,
    ExitProcessError
};