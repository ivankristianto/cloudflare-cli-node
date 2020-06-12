import Table from 'cli-table3';
import { map } from 'lodash';
import log from './logger';

class formatter {
	/**
	 * Format the output with table format
	 *
	 * @param {string} fields Table head, comma separated
	 * @param {Array} rows Rows of the data
	 */
	static toTable(fields, rows) {
		const table = new Table({
			head: fields.split(','),
			colWidths: fields.split(',').map((field) => {
				switch (field) {
					case 'id':
						return 35;
					case 'type':
						return 10;
					case 'proxied':
						return 10;
					case 'content':
						return 50;
					default:
						return 30;
				}
			}),
			wordWrap: true,
		});

		rows.forEach(function (row) {
			table.push(row);
		});

		log.success(table.toString());
	}

	/**
	 * Format the output with table format
	 *
	 * @param {string} fields Label, comma separated
	 * @param {Array} rows Rows of the data
	 */
	static toList(fields, rows) {
		const table = new Table({
			style: { border: [], header: [] },
			colWidths: [20, 80],
			wordWrap: true,
		});

		const labels = fields.split(',');

		labels.forEach(function (label, i) {
			const row = {};
			row[label] = rows[i];
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
		const truncate = (input) => (input.length > 70 ? `${input.substring(0, 70)}...` : input);

		return map(results, function (item) {
			const output = [];

			fields.split(',').forEach(function (field) {
				output.push(typeof item[field] === 'undefined' ? '' : truncate(item[field]));
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
				results.push(result[field].id);
				return;
			}
			results.push(typeof result[field] === 'undefined' ? '' : result[field]);
		});

		return results;
	}
}

export default formatter;
