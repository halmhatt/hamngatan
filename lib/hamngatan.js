"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

// Add promise shim
require("core-js/shim");

var moment = _interopRequire(require("moment"));

var request = _interopRequire(require("request"));

var xml2js = _interopRequire(require("xml2js"));

var API_URI = "http://opendata.linkoping.se/ws_opendata/Main.asmx/LuftDataLista";
var DATE_FORMAT = "YYYY-MM-DD";

function buildQuery(params) {
  var pairs = [];

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      pairs.push("" + key + "=" + params[key]);
    }
  }

  return pairs.join("&");
}

var Hamngatan = (function () {
  function Hamngatan(apiKey) {
    this.apiKey = apiKey;
  }

  _prototypeProperties(Hamngatan, null, {
    get: {

      /**
       * Get data from hamngatan API
       * @param  {Object}   options  Object containing options from: and [to:]
       * @param  {Function} callback Optional callback
       * @return {Promise}           A promise with the result
       */
      value: function get() {
        var options = arguments[0] === undefined ? {} : arguments[0];
        var callback = arguments[1] === undefined ? null : arguments[1];
        options.CustomKey = this.apiKey;
        options.SystemCodeNumber = "linkoping";
        options.tom = options.to || moment().format(DATE_FORMAT);

        if (!options.hasOwnProperty("from")) {
          throw new Error("You need to specify from date as YYYY-MM-DD");
        }

        var uri = "" + API_URI + "?" + buildQuery(options);

        return new Promise(function (resolve, reject) {
          request.get(uri, function (err, response, body) {
            if (err) return reject(err);

            resolve({ response: response, body: body });
          });
        }).then(function (response) {
          return new Promise(function (resolve, reject) {
            xml2js.parseString(response.body, function (err, result) {
              if (err) return reject(err);

              resolve(result);
            });
          });
        }).then(function (result) {
          if (result && result.ResponseListaLuftDataobjekt && result.ResponseListaLuftDataobjekt.ListaLuftDataobjekt.length > 0 && result.ResponseListaLuftDataobjekt.ListaLuftDataobjekt[0].LuftDataObj) {
            return result.ResponseListaLuftDataobjekt.ListaLuftDataobjekt[0].LuftDataObj;
          }

          return [];
        }).then(function (list) {
          return list.map(function (item) {
            return {
              SystemCodeNumber: item.SystemCodeNumber[0],
              LastUpdated: moment(item.LastUpdated[0]).toJSON(),
              PM10: parseFloat(item.PM10[0], 10)
            };
          });
        }).then(function (list) {
          if (callback) {
            callback(null, list);
          }

          return list;
        })
        // If any error
        .then(null, function (err) {
          if (callback) callback(err);
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Hamngatan;
})();

module.exports = Hamngatan;
