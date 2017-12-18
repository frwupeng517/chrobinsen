
var isHttps = false;
console.log("main protocol : " + window.location.protocol);
if (window.location.protocol == "https:") {
  isHttps = true;
}
console.log("main routeSecure : " + isHttps);
global.routeSecure = isHttps
