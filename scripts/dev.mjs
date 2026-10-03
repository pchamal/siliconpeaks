import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createPreviewServer} from './preview-server.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const server=createPreviewServer(root);
server.on('error',err=>{console.error(err.code==='EADDRINUSE'?'Port 3000 is already occupied. Stop that server before starting Silicon Peaks.':err);process.exit(1);});
server.listen(3000,()=>console.log('Silicon Peaks: http://localhost:3000 (static local preview)'));
