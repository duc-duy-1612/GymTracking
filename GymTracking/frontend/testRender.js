const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Model = require('react-body-highlighter').default;

try {
  const html = ReactDOMServer.renderToString(React.createElement(Model, { data: [], type: 'anterior', style: { width: '100px' }, highlightedColors: ['red'] }));
  console.log("SUCCESS:", html.substring(0, 100));
} catch(err) {
  console.log("ERROR:", err.message, err.stack);
}
