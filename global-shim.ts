import { createRequire } from 'module';
const require = createRequire(import.meta.url);
window.global = window;
global.Buffer = require('buffer').Buffer;
global.process = require('process');