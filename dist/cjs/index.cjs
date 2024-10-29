"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format2) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format2];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env) {
      if (env.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.formatWithOptions(exports2.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// dist/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  DataType: () => DataType,
  DataTypeCaster: () => DataTypeCaster,
  DataValidator: () => DataValidator,
  TypeCastError: () => TypeCastError,
  arrayTypeValidator: () => arrayTypeValidator,
  booleanTypeValidator: () => booleanTypeValidator,
  dataTypeFrom: () => dataTypeFrom,
  isRequiredValidator: () => isRequiredValidator,
  numberTypeValidator: () => numberTypeValidator,
  objectTypeValidator: () => objectTypeValidator,
  stringTypeValidator: () => stringTypeValidator,
  typeCastToArray: () => typeCastToArray,
  typeCastToBoolean: () => typeCastToBoolean,
  typeCastToNumber: () => typeCastToNumber,
  typeCastToPlainObject: () => typeCastToPlainObject,
  typeCastToString: () => typeCastToString
});
module.exports = __toCommonJS(esm_exports);

// dist/esm/data-schema.js
var DataType;
(function(DataType2) {
  DataType2["ANY"] = "Any";
  DataType2["STRING"] = "String";
  DataType2["NUMBER"] = "Number";
  DataType2["BOOLEAN"] = "Boolean";
  DataType2["ARRAY"] = "Array";
  DataType2["OBJECT"] = "Object";
})(DataType || (DataType = {}));
function dataTypeFrom(value) {
  if (value == null)
    return void 0;
  const baseType = typeof value;
  if (baseType === "string")
    return DataType.STRING;
  if (baseType === "number")
    return DataType.NUMBER;
  if (baseType === "boolean")
    return DataType.BOOLEAN;
  if (Array.isArray(value))
    return DataType.ARRAY;
  if (baseType === "object")
    return DataType.OBJECT;
  return void 0;
}

// node_modules/@e22m4u/js-format/src/utils/is-class.js
function isClass(value) {
  if (!value) return false;
  return typeof value === "function" && /^class\s/.test(Function.prototype.toString.call(value));
}

// node_modules/@e22m4u/js-format/src/value-to-string.js
var BASE_CTOR_NAMES = [
  "String",
  "Number",
  "Boolean",
  "Object",
  "Array",
  "Function",
  "Symbol",
  "Map",
  "Set",
  "Date"
];
function valueToString(input) {
  if (input == null) return String(input);
  if (typeof input === "string") return `"${input}"`;
  if (typeof input === "number" || typeof input === "boolean")
    return String(input);
  if (isClass(input)) return input.name ? input.name : "Class";
  if (input.constructor && input.constructor.name)
    return BASE_CTOR_NAMES.includes(input.constructor.name) ? input.constructor.name : `${input.constructor.name} (instance)`;
  if (typeof input === "object" && input.constructor == null) return "Object";
  return String(input);
}

// node_modules/@e22m4u/js-format/src/array-to-list.js
var SEPARATOR = ", ";
function arrayToList(input) {
  if (Array.isArray(input) && input.length)
    return input.map(valueToString).join(SEPARATOR);
  return valueToString(input);
}

// node_modules/@e22m4u/js-format/src/format.js
function format(pattern) {
  if (pattern instanceof Date) {
    pattern = pattern.toISOString();
  } else if (typeof pattern !== "string") {
    pattern = String(pattern);
  }
  const re = /(%?)(%([sdjvl]))/g;
  const args = Array.prototype.slice.call(arguments, 1);
  if (args.length) {
    pattern = pattern.replace(re, function(match, escaped, ptn, flag) {
      let arg = args.shift();
      switch (flag) {
        case "s":
          arg = String(arg);
          break;
        case "d":
          arg = Number(arg);
          break;
        case "j":
          arg = JSON.stringify(arg);
          break;
        case "v":
          arg = valueToString(arg);
          break;
        case "l":
          arg = arrayToList(arg);
          break;
      }
      if (!escaped) return arg;
      args.unshift(arg);
      return match;
    });
  }
  if (args.length) pattern += " " + args.join(" ");
  pattern = pattern.replace(/%{2}/g, "%");
  return "" + pattern;
}

// node_modules/@e22m4u/js-format/src/errorf.js
var Errorf = class extends Error {
  /**
   * Constructor.
   *
   * @param {string|undefined} pattern
   * @param {any} args
   */
  constructor(pattern = void 0, ...args) {
    const message = pattern != null ? format(pattern, ...args) : void 0;
    super(message);
  }
};

// dist/esm/errors/type-cast-error.js
var TypeCastError = class extends Error {
  value;
  targetType;
  constructor(value, targetType) {
    const sourceType = dataTypeFrom(value);
    const message = format("Unable to cast %s to %s.", sourceType, targetType);
    super(message);
    this.value = value;
    this.targetType = targetType;
  }
};

// dist/esm/errors/validation-error.js
var ValidationError = class extends Errorf {
};

// dist/esm/validators/array-type-validator.js
function arrayTypeValidator(value, schema, sourcePath) {
  if (schema.type === DataType.ARRAY && !Array.isArray(value)) {
    if (sourcePath) {
      throw new ValidationError("Value of %v must be an Array, but %v given.", sourcePath, value);
    } else {
      throw new ValidationError("Value must be an Array, but %v given.", value);
    }
  }
}

// dist/esm/validators/is-required-validator.js
function isRequiredValidator(value, schema, sourcePath) {
  if (schema.required && value == null) {
    if (sourcePath) {
      throw new ValidationError("Value of %v is required, but %v given.", sourcePath, value);
    } else {
      throw new ValidationError("Value is required, but %v given.", value);
    }
  }
}

// dist/esm/validators/number-type-validator.js
function numberTypeValidator(value, schema, sourcePath) {
  if (schema.type === DataType.NUMBER && (typeof value !== "number" || isNaN(value))) {
    if (sourcePath) {
      throw new ValidationError("Value of %v must be a Number, but %v given.", sourcePath, value);
    } else {
      throw new ValidationError("Value must be a Number, but %v given.", value);
    }
  }
}

// dist/esm/validators/object-type-validator.js
function objectTypeValidator(value, schema, sourcePath) {
  if (schema.type === DataType.OBJECT && (value === null || typeof value !== "object" || Array.isArray(value) || value.constructor !== Object)) {
    if (sourcePath) {
      throw new ValidationError("Value of %v must be a plain Object, but %v given.", sourcePath, value);
    } else {
      throw new ValidationError("Value must be a plain Object, but %v given.", value);
    }
  }
}

// dist/esm/validators/string-type-validator.js
function stringTypeValidator(value, schema, sourcePath) {
  if (schema.type === DataType.STRING && typeof value !== "string") {
    if (sourcePath) {
      throw new ValidationError("Value of %v must be a String, but %v given.", sourcePath, value);
    } else {
      throw new ValidationError("Value must be a String, but %v given.", value);
    }
  }
}

// dist/esm/validators/boolean-type-validator.js
function booleanTypeValidator(value, schema, sourcePath) {
  if (schema.type === DataType.BOOLEAN && typeof value !== "boolean") {
    if (sourcePath) {
      throw new ValidationError("Value of %v must be a Boolean, but %v given.", sourcePath, value);
    } else {
      throw new ValidationError("Value must be a Boolean, but %v given.", value);
    }
  }
}

// node_modules/@e22m4u/js-service/src/errors/invalid-argument-error.js
var InvalidArgumentError = class extends Errorf {
};

// node_modules/@e22m4u/js-service/src/service-container.js
var ServiceContainer = class _ServiceContainer {
  /**
   * Services map.
   *
   * @type {Map<any, any>}
   * @private
   */
  _services = /* @__PURE__ */ new Map();
  /**
   * Parent container.
   *
   * @type {ServiceContainer}
   * @private
   */
  _parent;
  /**
   * Constructor.
   *
   * @param {ServiceContainer|undefined} parent
   */
  constructor(parent = void 0) {
    if (parent != null) {
      if (!(parent instanceof _ServiceContainer))
        throw new InvalidArgumentError(
          'The provided parameter "parent" of ServicesContainer.constructor must be an instance ServiceContainer, but %v given.',
          parent
        );
      this._parent = parent;
    }
  }
  /**
   * Получить существующий или новый экземпляр.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {*}
   */
  get(ctor, ...args) {
    if (!ctor || typeof ctor !== "function")
      throw new InvalidArgumentError(
        "The first argument of ServicesContainer.get must be a class constructor, but %v given.",
        ctor
      );
    if (!this._services.has(ctor) && this._parent && this._parent.has(ctor)) {
      return this._parent.get(ctor);
    }
    let service = this._services.get(ctor);
    if (!service || args.length) {
      service = "prototype" in ctor && ctor.prototype instanceof Service ? new ctor(this, ...args) : new ctor(...args);
      this._services.set(ctor, service);
    } else if (typeof service === "function") {
      service = service();
      this._services.set(ctor, service);
    }
    return service;
  }
  /**
   * Проверка существования конструктора в контейнере.
   *
   * @param {*} ctor
   * @return {boolean}
   */
  has(ctor) {
    if (this._services.has(ctor)) return true;
    if (this._parent) return this._parent.has(ctor);
    return false;
  }
  /**
   * Добавить конструктор в контейнер.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {this}
   */
  add(ctor, ...args) {
    if (!ctor || typeof ctor !== "function")
      throw new InvalidArgumentError(
        "The first argument of ServicesContainer.add must be a class constructor, but %v given.",
        ctor
      );
    const factory = () => ctor.prototype instanceof Service ? new ctor(this, ...args) : new ctor(...args);
    this._services.set(ctor, factory);
    return this;
  }
  /**
   * Добавить конструктор и создать экземпляр.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {this}
   */
  use(ctor, ...args) {
    if (!ctor || typeof ctor !== "function")
      throw new InvalidArgumentError(
        "The first argument of ServicesContainer.use must be a class constructor, but %v given.",
        ctor
      );
    const service = ctor.prototype instanceof Service ? new ctor(this, ...args) : new ctor(...args);
    this._services.set(ctor, service);
    return this;
  }
  /**
   * Добавить конструктор и связанный экземпляр.
   *
   * @param {*} ctor
   * @param {*} service
   * @return {this}
   */
  set(ctor, service) {
    if (!ctor || typeof ctor !== "function")
      throw new InvalidArgumentError(
        "The first argument of ServicesContainer.set must be a class constructor, but %v given.",
        ctor
      );
    if (!service || typeof service !== "object" || Array.isArray(service))
      throw new InvalidArgumentError(
        "The second argument of ServicesContainer.set must be an Object, but %v given.",
        service
      );
    this._services.set(ctor, service);
    return this;
  }
};

// node_modules/@e22m4u/js-service/src/service.js
var Service = class {
  /**
   * Container.
   *
   * @type {ServiceContainer}
   */
  container;
  /**
   * Constructor.
   *
   * @param {ServiceContainer|undefined} container
   */
  constructor(container = void 0) {
    this.container = container instanceof ServiceContainer ? container : new ServiceContainer();
  }
  /**
   * Получить существующий или новый экземпляр.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {*}
   */
  getService(ctor, ...args) {
    return this.container.get(ctor, ...args);
  }
  /**
   * Проверка существования конструктора в контейнере.
   *
   * @param {*} ctor
   * @return {boolean}
   */
  hasService(ctor) {
    return this.container.has(ctor);
  }
  /**
   * Добавить конструктор в контейнер.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {this}
   */
  addService(ctor, ...args) {
    this.container.add(ctor, ...args);
    return this;
  }
  /**
   * Добавить конструктор и создать экземпляр.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {this}
   */
  useService(ctor, ...args) {
    this.container.use(ctor, ...args);
    return this;
  }
  /**
   * Добавить конструктор и связанный экземпляр.
   *
   * @param {*} ctor
   * @param {*} service
   * @return {this}
   */
  setService(ctor, service) {
    this.container.set(ctor, service);
    return this;
  }
};

// dist/esm/utils/to-camel-case.js
function toCamelCase(input) {
  return input.replace(/(^\w|[A-Z]|\b\w)/g, (c) => c.toUpperCase()).replace(/\W+/g, "").replace(/(^\w)/g, (c) => c.toLowerCase());
}

// dist/esm/utils/create-debugger.js
var import_debug = __toESM(require_src(), 1);
function createDebugger(name) {
  const debug = (0, import_debug.default)(`tsDataSchema:${name}`);
  return function(message, ...args) {
    const interpolatedMessage = format(message, ...args);
    return debug(interpolatedMessage);
  };
}

// dist/esm/debuggable-service.js
var DebuggableService = class extends Service {
  /**
   * Debug.
   */
  debug;
  /**
   * Constructor.
   *
   * @param container
   */
  constructor(container) {
    super(container);
    const serviceName = toCamelCase(this.constructor.name);
    this.debug = createDebugger(serviceName);
    this.debug("%v is created.", this.constructor);
  }
};

// dist/esm/data-validator.js
var DataValidator = class extends DebuggableService {
  /**
   * Validators.
   *
   * @protected
   */
  validatorMap = /* @__PURE__ */ new Set([
    stringTypeValidator,
    numberTypeValidator,
    booleanTypeValidator,
    arrayTypeValidator,
    objectTypeValidator,
    isRequiredValidator
  ]);
  /**
   * Add validator.
   *
   * @param fn
   */
  addValidator(fn) {
    this.validatorMap.add(fn);
    this.debug("Validator %v is added.", fn.name);
    return this;
  }
  /**
   * Has validator.
   *
   * @param fn
   */
  hasValidator(fn) {
    return this.validatorMap.has(fn);
  }
  /**
   * Get validators.
   */
  getValidators() {
    return Array.from(this.validatorMap.values());
  }
  /**
   * Remove validator.
   *
   * @param fn
   */
  removeValidator(fn) {
    if (this.validatorMap.has(fn)) {
      this.validatorMap.delete(fn);
      this.debug("Validator %v is removed.", fn.name);
      return this;
    }
    throw new Errorf("Unable to remove non-existent validator %v.", fn.name);
  }
  /**
   * Remove all validators.
   */
  removeAllValidators() {
    this.validatorMap.clear();
    return this;
  }
  /**
   * Validate.
   *
   * @param value
   * @param schema
   * @param sourcePath A path like 'body.user.name' from which the value.
   */
  validate(value, schema, sourcePath) {
    this.debug("Validation.");
    if (sourcePath)
      this.debug("Source path is %v.", sourcePath);
    const validators = this.getValidators();
    if (validators.length) {
      this.debug("%v global validators found.", validators.length);
      validators.forEach((fn) => fn(value, schema, sourcePath));
      this.debug("Global validators are passed.");
    } else {
      this.debug("No global validators found.");
    }
    let localValidators = [];
    if (Array.isArray(schema.validate)) {
      localValidators = schema.validate;
    } else if (typeof schema.validate === "function") {
      localValidators = [schema.validate];
    }
    if (localValidators.length) {
      this.debug("%v local validators found.", localValidators.length);
      localValidators.forEach((fn) => fn(value, schema, sourcePath));
      this.debug("Local validators are passed.");
    } else {
      this.debug("No local validators found.");
    }
    if (schema.type === DataType.ARRAY && schema.items && Array.isArray(value)) {
      this.debug("Starting array items validation.");
      const valueAsArray = value;
      for (const index in valueAsArray) {
        const elValue = valueAsArray[index];
        const elSchema = schema.items;
        const elSourcePath = sourcePath ? `${sourcePath}[${index}]` : `Array[${index}]`;
        this.validate(elValue, elSchema, elSourcePath);
      }
      this.debug("Array items validation is done.");
    }
    if (schema.type === DataType.OBJECT && schema.properties && value !== null && typeof value === "object" && !Array.isArray(value)) {
      this.debug("Starting object properties validation.");
      const valueAsObject = value;
      for (const propName in schema.properties) {
        const propSchema = schema.properties[propName];
        const propValue = valueAsObject[propName];
        const propSourcePath = sourcePath ? `${sourcePath}.${propName}` : propName;
        this.validate(propValue, propSchema, propSourcePath);
      }
      this.debug("Object properties validation is done.");
    }
    this.debug("Validation of %v is done.", sourcePath);
  }
};

// dist/esm/type-casters/type-cast-to-array.js
function typeCastToArray(value) {
  if (Array.isArray(value))
    return value;
  if (typeof value === "string") {
    value = value.trim();
    let newValue;
    try {
      newValue = JSON.parse(value);
    } catch {
    }
    if (Array.isArray(newValue))
      return newValue;
  }
  throw new TypeCastError(value, DataType.STRING);
}

// dist/esm/type-casters/type-cast-to-string.js
function typeCastToString(value) {
  if (typeof value === "string")
    return value;
  if (typeof value === "number")
    return String(value);
  throw new TypeCastError(value, DataType.STRING);
}

// dist/esm/type-casters/type-cast-to-number.js
function typeCastToNumber(value) {
  if (typeof value === "string") {
    if (value.length <= 20) {
      const newValue = Number(value);
      if (!isNaN(newValue))
        return newValue;
    }
  } else if (typeof value === "number") {
    return value;
  } else if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  throw new TypeCastError(value, DataType.NUMBER);
}

// dist/esm/type-casters/type-cast-to-boolean.js
function typeCastToBoolean(value) {
  if (typeof value === "string") {
    value = value.trim();
    if (value === "1")
      return true;
    if (value === "0")
      return false;
    if (value === "true")
      return true;
    if (value === "false")
      return false;
  } else if (typeof value === "number") {
    if (value === 1)
      return true;
    if (value === 0)
      return false;
  } else if (typeof value === "boolean") {
    return value;
  }
  throw new TypeCastError(value, DataType.BOOLEAN);
}

// dist/esm/type-casters/type-cast-to-plain-object.js
function typeCastToPlainObject(value) {
  let newValue = value;
  if (typeof value === "string") {
    value = value.trim();
    try {
      newValue = JSON.parse(value);
    } catch {
    }
  }
  if (newValue != null && typeof newValue === "object" && !Array.isArray(newValue) && newValue.constructor === Object) {
    return newValue;
  }
  throw new TypeCastError(value, DataType.OBJECT);
}

// dist/esm/data-type-caster.js
var DataTypeCaster = class extends DebuggableService {
  /**
   * Type caster map.
   *
   * @protected
   */
  typeCasterMap = /* @__PURE__ */ new Map([
    [DataType.STRING, typeCastToString],
    [DataType.NUMBER, typeCastToNumber],
    [DataType.BOOLEAN, typeCastToBoolean],
    [DataType.ARRAY, typeCastToArray],
    [DataType.OBJECT, typeCastToPlainObject]
  ]);
  /**
   * Set type caster.
   *
   * @param type
   * @param caster
   */
  setTypeCaster(type, caster) {
    this.typeCasterMap.set(type, caster);
    this.debug("A type caster %v is set for %s type.", caster.name, type);
    return this;
  }
  /**
   * Get type caster.
   *
   * @param type
   */
  getTypeCaster(type) {
    const typeCaster = this.typeCasterMap.get(type);
    if (typeCaster)
      return typeCaster;
    throw new Errorf("No type caster found for %s type.", type);
  }
  /**
   * Cast.
   *
   * @param value
   * @param schema
   * @param options
   */
  cast(value, schema, options) {
    var _a;
    this.debug("Type casting.");
    const sourcePath = options == null ? void 0 : options.sourcePath;
    if (sourcePath)
      this.debug("Source path is %v.", sourcePath);
    const noTypeCastError = (_a = options == null ? void 0 : options.noTypeCastError) != null ? _a : false;
    if (noTypeCastError)
      this.debug("Type cast errors are disabled.");
    if (!schema.type) {
      this.debug("Data schema does not have the type definition.");
      this.debug("Type casting is skipped.");
      return value;
    }
    const targetType = schema.type;
    if (value == null) {
      if (noTypeCastError) {
        this.debug("No type casting required for %v.", value);
        this.debug("Type casting is skipped.");
        return value;
      } else {
        throw new TypeCastError(value, targetType);
      }
    }
    const sourceType = dataTypeFrom(value);
    this.debug("Source type is %s.", sourceType);
    this.debug("Target type is %s.", targetType);
    if (targetType === DataType.ANY) {
      this.debug("No type casting required for Any.");
      this.debug("Type casting is skipped.");
      return value;
    }
    let newValue = value;
    if (sourceType !== targetType) {
      const caster = this.getTypeCaster(schema.type);
      try {
        newValue = caster(value);
      } catch (error) {
        if (noTypeCastError && error instanceof TypeCastError) {
          this.debug(error.message);
          this.debug("Type casting is skipped.");
          return value;
        }
        throw error;
      }
    } else if (sourceType !== DataType.ARRAY && sourceType !== DataType.OBJECT) {
      this.debug("Source and target types are the same.");
      this.debug("Type casting is skipped.");
      return value;
    }
    if (targetType === DataType.ARRAY && schema.items && Array.isArray(newValue)) {
      this.debug("Starting type casting of array items.");
      const valueAsArray = newValue;
      for (const index in valueAsArray) {
        const elValue = valueAsArray[index];
        const elSchema = schema.items;
        const elSourcePath = sourcePath ? `${sourcePath}[${index}]` : `Array[${index}]`;
        valueAsArray[index] = this.cast(elValue, elSchema, {
          sourcePath: elSourcePath,
          noTypeCastError
        });
      }
      this.debug("Type casting of array items is done.");
    }
    if (schema.type === DataType.OBJECT && schema.properties && newValue !== null && typeof newValue === "object" && !Array.isArray(newValue)) {
      this.debug("Starting type casting of object properties.");
      const valueAsObject = newValue;
      for (const propName in schema.properties) {
        const propSchema = schema.properties[propName];
        const propValue = valueAsObject[propName];
        const propSourcePath = sourcePath ? `${sourcePath}.${propName}` : propName;
        valueAsObject[propName] = this.cast(propValue, propSchema, {
          sourcePath: propSourcePath,
          noTypeCastError
        });
      }
      this.debug("Type casting of object properties is done.");
    }
    this.debug("%s has been casted to %s.", sourceType, targetType);
    this.debug("New value is %v.", newValue);
    return newValue;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DataType,
  DataTypeCaster,
  DataValidator,
  TypeCastError,
  arrayTypeValidator,
  booleanTypeValidator,
  dataTypeFrom,
  isRequiredValidator,
  numberTypeValidator,
  objectTypeValidator,
  stringTypeValidator,
  typeCastToArray,
  typeCastToBoolean,
  typeCastToNumber,
  typeCastToPlainObject,
  typeCastToString
});
