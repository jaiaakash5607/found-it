// api/index.js
import serverless from 'serverless-http';
import app from './server.orig.js';
export default serverless(app);

const serverless = require('serverless-http');
const app = require('./server.orig.js'); // path to the Express app we exported
module.exports = serverless(app);
