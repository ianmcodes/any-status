const { STATUS_CODES } = require('node:http');
const express = require('express');

const MIN_STATUS = 100;
const MAX_STATUS = 599;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderPage(title, heading, message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
</head>
<body>
<h1>${escapeHtml(heading)}</h1>
<p>${escapeHtml(message)}</p>
</body>
</html>
`;
}

function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.get('/', (req, res) => {
    res.type('html').send(
      renderPage(
        'any-status',
        'any-status',
        `Request any HTTP status code by putting it in the path, for example /404. Supported range: ${MIN_STATUS}-${MAX_STATUS}.`
      )
    );
  });

  app.get('/:status', (req, res, next) => {
    const { status } = req.params;

    if (!/^[1-5][0-9]{2}$/.test(status)) {
      next();
      return;
    }

    const code = Number(status);
    const reason = STATUS_CODES[code];
    const heading = reason ? `${code} ${reason}` : String(code);
    const message = reason
      ? `This response has HTTP status code ${code}, which means "${reason}".`
      : `This response has HTTP status code ${code}, which is not a standard HTTP status code.`;

    res.status(code).type('html').send(renderPage(heading, heading, message));
  });

  app.use((req, res) => {
    res
      .status(404)
      .type('html')
      .send(
        renderPage(
          '404 Not Found',
          '404 Not Found',
          `There is nothing here. Request an HTTP status code between ${MIN_STATUS} and ${MAX_STATUS} directly, for example /404.`
        )
      );
  });

  return app;
}

module.exports = { createApp };
