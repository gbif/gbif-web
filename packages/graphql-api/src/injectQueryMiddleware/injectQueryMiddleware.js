
let cheerio = require('cheerio');
let interceptor = require('express-interceptor');

let injectQuery = interceptor(function (req, res) {
  return {
    // Only HTML responses will be intercepted
    isInterceptable: function () {
      return /text\/html/.test(res.get('Content-Type'));
    },
    // Appends a paragraph at the end of the response body
    intercept: function (body, send) {
      var $document = cheerio.load(body);
      let variables = req.query.variables;
      if (variables && typeof variables === 'string') {
        try {
          variables = JSON.parse(variables);
        } catch (err) {
          // ignore
        }
      }
      if (variables && typeof variables === 'object') {
        variables = JSON.stringify(variables, null, 2);
      }
      const script = `<script>
      function tamperWithStore() {
        try {
          console.warn('Try changing localstorage to inject our query');
          var stored = JSON.parse(localStorage.getItem('graphql-playground'));
          var workspace = stored.workspaces[stored.selectedWorkspace];
          var session = workspace.sessions.selectedSessionId;
          workspace.sessions.sessions[session].query = \`${req.query.query ? req.query.query : ''}\`;
          workspace.sessions.sessions[session].variables = \`${variables ? variables : ''}\`;
          localStorage.setItem('graphql-playground', JSON.stringify(stored));
          ${req.query.queryId ? `window.location = '/graphql'` : '//No queryId provided'};
        } catch(err) {
          console.warn('Store not ready, set timeout and try again in 100ms');
          window.setTimeout(tamperWithStore, 100);
        }
      }
      tamperWithStore();
      </script>`;
      $document('body').append(script);

      send($document.html());
    }
  };
});

module.exports = injectQuery;