const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { name } = require('./package.json');

async function build() {
	await exec('rm -rf build');
	await exec('mkdir -p build');
	await exec('cp package.json build/');
	await exec('cd build && npm install --production');
	await exec('cp -r src/* build/');
	await exec(`cd build && zip -r ./${name}.zip *`);
}

build();
