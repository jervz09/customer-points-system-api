import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadValidators(dirPath) {
	const entries = await fs.readdir(dirPath, { withFileTypes: true });
	const result = {};

	for (const entry of entries) {
		const entryPath = path.join(dirPath, entry.name);

		if (entry.isDirectory()) {
			// recursively load subfolders
			result[entry.name] = await loadValidators(entryPath);
		} else if (
			entry.isFile() &&
			entry.name.endsWith('.js') &&
			entry.name !== 'index.js'
		) {
			const validatorName = path.basename(entry.name, '.js');
			const module = await import(path.join(dirPath, entry.name));
			result[validatorName] = module.default;
		}
	}

	return result;
}

const validators = await loadValidators(__dirname);
export default validators;
