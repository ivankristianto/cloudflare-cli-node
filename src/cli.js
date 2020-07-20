/**
 * Internal dependencies
 */
import yargs from 'yargs';
import log from './utils/logger';

// eslint-disable-next-line consistent-return
function main() {
	try {
		return yargs
			.commandDir('commands')
			.demandCommand()
			.option('disableSpinner', {
				description: 'Disable spinner',
				default: false,
				type: 'boolean',
			})
			.option('debug', {
				description: 'Enable debug messages',
				default: false,
				type: 'boolean',
			})
			.help()
			.wrap(Math.min(120, yargs.terminalWidth())).argv;
	} catch (e) {
		log.error(e.toString());
	}
}

main();
