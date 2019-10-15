/*
 * Copyright 2016, Matthieu Dumas
 * This work is licensed under the Creative Commons Attribution 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
 */

/* Usage : 
 * var log = Logger.get("myModule") // .level(Logger.ALL) implicit
 * log.info("always a string as first argument", then, other, stuff)
 * log.level(Logger.WARN) // or ALL, DEBUG, INFO, WARN, ERROR, OFF
 * log.debug("does not show")
 * log("but this does because direct call on logger is not filtered by level")
 */
var Logger = (function() {
    var levels = {
        ALL:100,
        DEBUG:100,
        INFO:200,
        WARN:300,
        ERROR:400,
        OFF:500
    };
    var loggerCache = {};
    var cons = console;
    var noop = function() {};
    var level = function(level) {
        this.error = level<=levels.ERROR ? cons.error.bind(cons, "["+this.id+"] - E - %s") : noop;
        this.warn = level<=levels.WARN ? cons.warn.bind(cons, "["+this.id+"] - W - %s") : noop;
        this.info = level<=levels.INFO ? cons.info.bind(cons, "["+this.id+"] - I - %s") : noop;
        this.debug = level<=levels.DEBUG ? cons.log.bind(cons, "["+this.id+"] - D - %s") : noop;
        this.log = cons.log.bind(cons, "["+this.id+"] %s");
        return this;
    };
    levels.get = function(id) {
        var res = loggerCache[id];
        if (!res) {
            var ctx = {id:id,level:level}; // create a context
            ctx.level(Logger.ALL); // apply level
            res = ctx.log; // extract the log function, copy context to it and returns it
            for (var prop in ctx)
                res[prop] = ctx[prop];
            loggerCache[id] = res;
        }
        return res;
    };
    return levels; // return levels augmented with "get"
})();

module.exports = Logger
