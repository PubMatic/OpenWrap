console.log("running from shell script");
var shell = require('shelljs');

shell.exec("gulp clean");

shell.cd("../Prebid.js/");
// cd ../Prebid.js/

shell.exec("gulp webpack");
// gulp webpack

shell.cd("../OpenWrap/")
// cd ../OpenWrap/

shell.cp("../Prebid.js/build/dist/prebid.js", "." )
// cp ../Prebid.js/build/dist/prebid.js .

shell.exec("gulp webpack");

shell.exec("gulp buildcerebro");
// gulp buildcerebro