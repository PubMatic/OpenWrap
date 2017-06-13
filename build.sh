#! /usr/bin/env node
console.log("running from shell script");
var shell = require('shelljs');
var argv = require('yargs').argv;

#
shell.exec("gulp clean");
shell.cd("../Prebid.js/");

var buildTaskName = "bundle";
var webpackTaskName = "pack";


if ( argv.mode && argv.mode == "test-build") {
	console.log("Executing test-build");
	buildTaskName = "dev" + buildTaskName;
	webpackTaskName = "dev" + webpackTaskName;

} else if ( argv.mode && argv.mode == "build" ) {
	console.log("Executing build");
	webpackTaskName = "web" + webpackTaskName;
} else {
	console.log("No mode supplied, Too few arguments");
	shell.exit(1);
}
 
#

# if (argv.dev) {
# 	buildTaskName = "dev" + buildTaskName;
# 	webpackTaskName = "dev" + webpackTaskName;
# } else {
# 	webpackTaskName = "web" + webpackTaskName;
# }

shell.exec("gulp " + webpackTaskName);

shell.cd("../OpenWrap/")

shell.exec("gulp " + webpackTaskName)

shell.exec("gulp " + buildTaskName);
