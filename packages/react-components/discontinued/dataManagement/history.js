let createBrowserHistory = {
  listen: x => ({unlisten: x => {}}),
  push: x => {}
};
if (typeof window !== 'undefined') {
  createBrowserHistory = require('history').createBrowserHistory();
}

export default createBrowserHistory;