import moment from 'moment';
import request from 'request';
import xml2js from 'xml2js';

const API_URI = 'http://opendata.linkoping.se/ws_opendata/Main.asmx/LuftDataLista';
const DATE_FORMAT = 'YYYY-MM-DD';

function buildQuery(params) {
	let pairs = [];

	for(let key in params) {
		if(params.hasOwnProperty(key)) {
			pairs.push(`${key}=${params[key]}`);
		}
	}

	return pairs.join('&');
}

class Hamngatan {
	constructor(apiKey) {
		this.apiKey = apiKey;
	}

	/**
	 * Get data from hamngatan API
	 * @param  {Object}   options  Object containing options from: and [to:]
	 * @param  {Function} callback Optional callback
	 * @return {Promise}           A promise with the result
	 */
	get(options, callback = null) {
		options.CustomKey = this.apiKey;
		options.SystemCodeNumber = 'linkoping';
		options.tom = options.to || moment().format(DATE_FORMAT)

		let uri = `${API_URI}?${buildQuery(options)}`;

		return new Promise((resolve, reject) => {
			request.get(uri, (err, response, body) => {
				if(err) return reject(err);

				resolve({response, body});
			});
		}).then((response) => {
			return new Promise((resolve, reject) => {
				xml2js.parseString(response.body, (err, result) => {
					if(err) return reject(err);

					resolve(result);
				});
			});
		})
		.then((result) => {
			if(result && 
				result.ResponseListaLuftDataobjekt &&
				result.ResponseListaLuftDataobjekt.ListaLuftDataobjekt.length > 0 &&
				result.ResponseListaLuftDataobjekt.ListaLuftDataobjekt[0].LuftDataObj) {

				return result.ResponseListaLuftDataobjekt.ListaLuftDataobjekt[0].LuftDataObj;
			}
			
			return [];
		})
		.then((list) => {

			return list.map((item) => {

				return {
					SystemCodeNumber: item.SystemCodeNumber[0],
					LastUpdated: moment(item.LastUpdated[0]).toJSON(),
					PM10: parseFloat(item.PM10[0], 10)
				};
			});
		})
		.then(list => {
			if(callback) {
				callback(null, list);
			}
		})
		// If any error
		.then(null, (err) => {if(callback) callback(err);});
	}
}

export default Hamngatan;