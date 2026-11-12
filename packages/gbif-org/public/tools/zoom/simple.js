// Kept out of simple.html so the page works under a Content-Security-Policy without 'unsafe-inline'.
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const src = urlParams.get('src');
const disableFullScreen = urlParams.get('disableFullScreen');

if (typeof disableFullScreen !== 'string')
  document.getElementById('full-page').classList.remove('full-page');

if (typeof src !== 'string') {
  document.getElementById('workingArea').style.display = 'none';
  document.getElementById('error').style.display = 'block';
  document.getElementById('error-message').innerHTML =
    'Missing image src in url. Use by adding an image url. E.g. ?src=https://images/123.jpg';
}
if (typeof src === 'string') {
  var viewer = OpenSeadragon({
    id: 'area',
    tileSources: {
      type: 'image',
      url: src,
    },
    showNavigator: false,
    toolbar: 'toolbarDiv',
    zoomInButton: 'zoom-in',
    zoomOutButton: 'zoom-out',
    homeButton: 'home',
    fullPageButton: disableFullScreen ? null : 'full-page',
    minZoomImageRatio: 0.7, // The minimum percentage ( expressed as a number between 0 and 1 ) of the viewport height or width at which the zoom out will be constrained. Setting it to 0, for example will allow you to zoom out infinity.
    maxZoomPixelRatio: 3, //The maximum ratio to allow a zoom-in to affect the highest level pixel ratio. This can be set to Infinity to allow 'infinite' zooming into the image though it is less effective visually if the HTML5 Canvas is not available on the viewing device.
  });

  // other relevant event type "add-item-failed"
  viewer.addHandler('open-failed', function (data) {
    document.getElementById('workingArea').style.display = 'none';
    document.getElementById('error').style.display = 'block';
  });

  viewer.addHandler('open', function (data) {
    document.getElementById('loader').style.display = 'none';
  });
}
