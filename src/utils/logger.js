/**
 * External dependencies
 */
import chalk from 'chalk';

const colorScheme = {
	success: chalk.green,
	info: chalk.white,
	warning: chalk.yellow,
	error: chalk.red,
	debug: chalk.blue,
};

/**
 * Log message with color scheme
 *
 * @param {Object} scheme Color scheme
 * @param {...any} args
 */
function log(scheme, ...args) {
	console.log(...args.map(arg => colorScheme[scheme](arg)));
}

/**
 * Log success message
 * @param {...any} args
 */
function success(...args) {
	log('success', ...args);
}

/**
 * Log info message
 * @param {...any} args
 */
function info(...args) {
	log('info', ...args);
}

/**
 * Log warning message
 * @param {...any} args
 */
function warning(...args) {
	log('warning', ...args);
}

/**
 * Log error message
 * @param {...any} args
 */
function error(...args) {
	log('error', ...args);
}

/**
 * Log debug message
 * @param {...any} args
 */
function debug(...args) {
	log('debug', ...args);
}

export default {
	success,
	info,
	warning,
	debug,
	error,
};
