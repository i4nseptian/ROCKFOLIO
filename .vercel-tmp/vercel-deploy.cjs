#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';
function log(msg) { console.error(msg); }
function checkVercel() {
try {
const result = spawnSync('vercel', ['whoami'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], shell: isWindows });
const output = (result.stdout || '').trim();
if (result.status === 0 && output && !output.includes('Error') && !output.includes('not logged in')) {
log(`Logged in as: ${output}`);
return true;
}
} catch { }
return false;
}
function deploy(projectPath) {
log('');
log('Starting deployment...');
log('');
try {
const args = ['--prod', '--yes'];
const result = spawnSync('vercel', args, {
cwd: projectPath,
encoding: 'utf8',
stdio: ['inherit', 'pipe', 'pipe'],
timeout: 300000,
shell: isWindows
});
const output = (result.stdout || '') + (result.stderr || '');
log(output);
if (result.status !== 0) throw new Error('Deploy failed');
const aliasedMatch = output.match(/Aliased:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
const deploymentMatch = output.match(/Production:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
const finalUrl = aliasedMatch ? aliasedMatch[1] : (deploymentMatch ? deploymentMatch[1] : null);
log('');
log('========================================');
log('Deployment successful!');
log('========================================');
log('');
if (finalUrl) {
log(`Your site is live! Visit: ${finalUrl}`);
console.log(JSON.stringify({ status: 'success', url: finalUrl }));
} else {
console.log(JSON.stringify({ status: 'success', message: 'Deployment successful' }));
}
} catch (error) {
log(error.message || '');
process.exit(1);
}
}
function main() {
log('========================================');
log('Vercel Deploy');
log('========================================');
if (!checkVercel()) {
log('Error: Not logged in. Run vercel login first.');
process.exit(1);
}
deploy(path.resolve('.'));
}
main();
