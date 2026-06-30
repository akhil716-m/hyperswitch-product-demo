// Vercel serverless entry point. Re-exports the existing Express app
// (server/server.js) so all of its routes run as one function. Requests
// are routed here via the rewrites in vercel.json.
module.exports = require('../server/server.js');
