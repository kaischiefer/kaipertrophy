import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
test('static build includes offline assets and excludes personal files',()=>{execFileSync(process.execPath,['build.mjs']);const files=readdirSync('dist').sort();assert.deepEqual(files,['app.js','icon.svg','importer.js','index.html','manifest.webmanifest','style.css','sw.js','sync.js']);const html=readFileSync('dist/index.html','utf8');assert.ok(!html.includes('href="/'));assert.ok(!html.includes('src="/'));assert.ok(html.includes('manifest.webmanifest'));assert.ok(!readFileSync('dist/style.css','utf8').includes('@import'));assert.ok(!readFileSync('dist/app.js','utf8').includes('exercise-plan.csv'));});
