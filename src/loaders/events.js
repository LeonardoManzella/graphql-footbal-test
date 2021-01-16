const EventEmitter = require("eventemitter3");

let Emitter = function () {
  EventEmitter.call(this);
};

Emitter.prototype.__proto__ = EventEmitter.prototype;

module.exports = new Emitter();
