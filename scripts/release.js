const { exec } = require('child_process');
const path = require('path');
const fse = require('fs-extra')




buildUI()
	.then(copyDirs);





// Internal logic
function buildUI() {
	return new Promise((resolve, reject) => {
		exec('npm run build', (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				reject();
			}
			
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
			
			resolve();
		});
	});
}


function copyDirs() {
	const releaseStr = 'release';
	return mkdir(releaseStr)
		.then(() => {
			const packageOld = path.resolve(__dirname, `../package.json`);
			const packageNew = path.resolve(__dirname, `../${releaseStr}/package.json`);
			
			const serverOld = path.resolve(__dirname, `../src/server/`);
			const serverNew = path.resolve(__dirname, `../${releaseStr}/server/`);
			
			const publicOld = path.resolve(__dirname, `../src/public/`);
			const publicNew = path.resolve(__dirname, `../${releaseStr}/public/`);
			
			const gitOld = path.resolve(__dirname, `../.git/`);
			const gitNew = path.resolve(__dirname, `../${releaseStr}/.git/`);
			
			return Promise.all([
				fse.copy(packageOld, packageNew),
				fse.copy(serverOld, serverNew),
				fse.copy(publicOld, publicNew),
				fse.copy(gitOld, gitNew)
			]);
		});
}


function mkdir(dirName) {
	const dir = path.resolve(__dirname, `../${dirName}`);
	return fse.ensureDir(dir);
}