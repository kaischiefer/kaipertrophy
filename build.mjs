import {mkdir,copyFile,rm} from 'node:fs/promises';
const files=['index.html','app.js','style.css','importer.js','sync.js','sw.js','manifest.webmanifest','icon.svg'];
await rm('dist',{recursive:true,force:true});await mkdir('dist');for(const file of files)await copyFile(file,'dist/'+file);
console.log('Built static app; private workout sheet excluded.');
