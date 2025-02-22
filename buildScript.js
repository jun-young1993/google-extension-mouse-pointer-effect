import * as fs from 'fs';
import * as path from 'path';
import { exit } from 'process';
/**
 * Build script for development environment
 *
 * This script:
 * 1. Checks if dist folder exists
 * 2. Deletes existing dist-dev folder if it exists
 * 3. Renames dist folder to dist-dev
 * 4. Modifies manifest.json to append '-dev' to extension name
 *
 * Usage:
 * ```
 * npm run dist:dev
 * ```
 *
 * This script is used as part of the build:dev npm script to prepare
 * the development build of the extension.
 */

console.log('Imported required modules');

// Error handling function
const handleError = (message) => {
  console.error(message);
  exit(1);
};

console.log('Defined error handling function');

// Check if dist folder exists
console.log('Checking if dist folder exists...');
if (!fs.existsSync('dist')) {
  handleError('Error: dist folder does not exist');
}
console.log('Starting build script...');

// Delete existing dist-dev folder if it exists
console.log('Checking if dist-dev folder exists...');
if (fs.existsSync('dist-dev')) {
  console.log('Deleting existing dist-dev folder...');
  fs.rmSync('dist-dev', { recursive: true, force: true });
}

// Rename dist folder to dist-dev
console.log('Renaming dist folder to dist-dev...');
console.log('Path: dist -> dist-dev');
fs.renameSync('dist', 'dist-dev');

// Read and modify manifest.json
console.log('Reading manifest.json...');
const manifestPath = path.join('dist-dev', 'manifest.json');
console.log(`Path: ${path.join('dist', 'manifest.json')} -> ${manifestPath}`);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
console.log('Modifying manifest name...');
manifest.name = manifest.name + '-dev';
console.log('Writing modified manifest.json...');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
