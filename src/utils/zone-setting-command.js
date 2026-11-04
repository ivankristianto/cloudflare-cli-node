import Zones from '../classes/zones';
import formatter from './formatter';
import withSpinner from './withSpinner';

/**
 * Build the handler for a `zones settings` subcommand: get the setting, or set it when --value is given.
 * @param {object} opts `setting` API id, `label` for spinner text, optional `parseValue`, `pickResult`, `defaultFormat`.
 * @returns {Function} yargs command handler
 */
export default function zoneSettingCommand(opts) {
	const {
		setting,
		label,
		parseValue = String,
		pickResult = (result) => result,
		defaultFormat,
	} = opts;

	async function runCommand(argv) {
		const { fields, format = defaultFormat, separator, spinner, value, zone } = argv;
		let response;

		if (value) {
			spinner.text = `Updating Zone ${label} setting…`;
			response = await Zones.setSettings(zone, setting, { value: parseValue(value) });
		} else {
			spinner.text = `Getting Zone ${label} setting…`;
			response = await Zones.getSettings(zone, setting);
		}

		const results = formatter.mappingField(fields, pickResult(response.result));

		formatter.output([results], { fields, format, separator });

		spinner.text = `Request to Zone ${label} setting done!`;
	}

	return withSpinner(runCommand);
}
