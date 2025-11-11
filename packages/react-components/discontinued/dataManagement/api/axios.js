import axios from "axios";

let CancelToken = axios.CancelToken;

function get(url, options) {
  let cancel;
  options = options || {};
  options.cancelToken = options.cancelToken || new CancelToken(function executor(c) {
    cancel = c;
  });
  let p = axios.get(url, options);
  return {promise: p, cancel};
}

function post(url, body, options) {
  let cancel;
  options = options || {};
  options.cancelToken = options.cancelToken || new CancelToken(function executor(c) {
    cancel = c;
  });
  let p = axios.post(url, body, options);
  return {promise: p, cancel};
}

export default {
  ...axios,
  get,
  post
};