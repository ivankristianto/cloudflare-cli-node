import Table from 'cli-table';
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
}

export default formatter;
