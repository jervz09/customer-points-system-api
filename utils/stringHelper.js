export function toSnakeCase(str) {
	return str.trim().toLowerCase().replace(/\s+/g, '_');
}

export function toCamelCase(str) {
	return str
		.trim()
		.toLowerCase()
		.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
}

export function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
