import Table from 'cli-table';
import { map } from 'lodash';
import log from './logger';

class formatter {
	/**
	 * Format the output with table format
	 *
	 * @param {string} fields Table head, comma separated
	 * @param {Array} rows Rows of the data
	 *
	 * @returns {string}
	 */
	static toTable(fields, rows) {
		const table = new Table({
			head: fields.split(','),
		});

		rows.forEach(function (row) {
			table.push(row);
		});

		log.success(table.toString());
	}

	/**
	 * Format the output as defined separator
	 *
	 * @param {Array} rows Rows of the data
	 * @param {string} separator Separator, default a space
	 */
	static toString(rows, separator = ' ') {
		log.success(rows.join(separator));
	}

	/**
	 * Format the output as JSON
	 *
	 * @param {Array} rows Rows of the data
	 */
	static toJson(rows) {
		log.success(JSON.stringify(rows));
	}

	/**
	 * Filter fields from array of json objects
	 *
	 * @param {string} fields Fields to get in comma separated
	 * @param {Array} results Array of json objects.
	 * @returns {Array}
	 */
	static mappingFields(fields, results) {
		return map(results, function (item) {
			const output = [];

			fields.split(',').forEach(function (field) {
				output.push(item[field] ? item[field] : '');
			});

			return output;
		});
	}

	/**
	 * Filter fields from a json object
	 *
	 * @param {string} fields Fields to get in comma separated
	 * @param {object} result A json objects.
	 * @returns {Array}
	 */
	static mappingField(fields, result) {
		const results = [];
		fields.split(',').forEach((field) => {
			if (field === 'filter') {
				result.push(result[field].id);
				return;
			}
			results.push(result[field]);
		});

		return results;
	}
}

export default formatter;
