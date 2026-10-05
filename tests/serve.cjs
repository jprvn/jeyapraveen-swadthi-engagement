const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.ics':'text/calendar','.webmanifest':'application/manifest+json'};
http.createServer((req,res) => {
  let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type',mime[path.extname(file)] || 'text/plain');res.end(fs.readFileSync(file));
}).listen(8765,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:8765/'));
