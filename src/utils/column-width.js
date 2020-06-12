export default function columnWidth(columnName) {
	switch (columnName) {
		case 'type':
		case 'status':
		case 'proxied':
			return 10;

		case 'id':
		case 'filter':
			return 35;

		case 'name':
		case 'development_mode':
			return 20;

		case 'content':
		case 'expression':
		case 'name_servers':
			return 50;

		default:
			return 30;
	}
}
