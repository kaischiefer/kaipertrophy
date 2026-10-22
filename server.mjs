import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
http.createServer(async(req,res)=>{try {const path=new URL(req.url,'http://localhost').pathname;const allowed={'/':'index.html','/app.js':'app.js','/style.css':'style.css','/importer.js':'importer.js','/sync.js':'sync.js','/sw.js':'sw.js','/manifest.webmanifest':'manifest.webmanifest','/icon.svg':'icon.svg'};if(!allowed[path]){res.writeHead(404);return res.end('Not found');}const file=allowed[path];res.setHeader('Content-Type',file.endsWith('.webmanifest')?'application/manifest+json':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(await readFile(root+file));}catch{res.writeHead(500);res.end('Unable to load app');}}).listen(Number(process.env.PORT||3000),'0.0.0.0');
