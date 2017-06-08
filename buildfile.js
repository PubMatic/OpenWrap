console.log("running from shell script");
var shell = require('shelljs');
var argv = require('yargs').argv;

shell.exec("gulp clean");

shell.cd("../Prebid.js/");

var buildTaskName = "build";
var webpackTaskName = "pack";

if (argv.dev) {
	buildTaskName = "dev" + buildTaskName;
	webpackTaskName = "dev" + webpackTaskName;
} else {
	webpackTaskName = "web" + webpackTaskName;
}

shell.exec("gulp " + webpackTaskName);

shell.cd("../OpenWrap/")

shell.exec("gulp " + webpackTaskName)

shell.exec("gulp " + buildTaskName);
