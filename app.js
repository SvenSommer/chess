const express = require('express');
const app = express();
const path = require('path');
const browserSync = require('browser-sync');
const port = process.env.PORT || 3001;

// Serve static files (CSS, JavaScript, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});

// Set timeout configurations
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

// Initialize BrowserSync and bind it to the Express server
const bs = browserSync.create();
bs.init({
  proxy: `http://localhost:${port}`,
  files: ['public/**/*.*'], // Watch for changes in these files/folders
  port: 5000, // Port for the BrowserSync server
}, function (err, bs) {
  console.log(`BrowserSync running on port ${bs.options.get('port')}!`);
});

// Export the app and server for testing purposes (optional)
module.exports = { app, server };
