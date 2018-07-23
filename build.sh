#! /usr/bin/env node
console.log("running from shell script");
var shell = require('shelljs');
var argv = require('yargs').argv;

shell.exec("gulp clean");

var prebidRepoPath = argv.prebidpath || "../Prebid.js/";
var task = argv.task || "wrapper";

console.log("ARGV ==>", argv);

var prebidTaskName = "";
var openwrapBuildTaskName = "";
var openwrapWebpackTaskName = "";
var CREATIVE_TASK = "creative"

if (task == CREATIVE_TASK) {
		console.log("inside creative");
		if (shell.exec("gulp webpack-creative --mode=" + argv.mode).code !== 0) {
			shell.echo('Error: webpack bundle and dist creative task failed');
			shell.exit(1);
		}

		if (shell.exec("gulp bundle-creative --mode=" + argv.mode).code !== 0) {
			shell.echo('Error:creative build task failed');
			shell.exit(1);
		}
} else {
		if (shell.cd(prebidRepoPath).code !== 0) {
			shell.echo("Couldnt change the dir to Prebid repo");
			shell.exit(1);
		}

		if ( argv.mode && argv.mode == "test-build") {
			console.log("Executing test-build");
			prebidTaskName = "build-bundle-dev --modules=modules.json";
			openwrapBuildTaskName = "devbundle";
			openwrapWebpackTaskName = "devpack";

		} else if ( argv.mode && argv.mode == "dev-build" ) {
			console.log("Executing build");
			prebidTaskName = "build --modules=modules.json";
			openwrapBuildTaskName = "bundle";
			openwrapWebpackTaskName = "webpack";

		} else if ( argv.mode && argv.mode == "build" ) {
			console.log("Executing build");
			prebidTaskName = "bundle --modules=modules.json";
			openwrapBuildTaskName = "bundle";
			openwrapWebpackTaskName = "webpack";

		} else {
			console.log("No mode supplied, Too few arguments");
			shell.exit(1);
		}


		if(shell.exec("gulp " + prebidTaskName + " --mode=" + argv.mode).code !== 0) {
			shell.echo('Error: buidlinng of project failed');
		  	shell.exit(1);
		}

		shell.cd("../OpenWrap/");
		if (argv.mode == "test-build") {
			if(shell.exec("gulp testall" + " --mode=" + argv.mode).code !== 0) {
				shell.echo('Error: test cases failed');
		  		shell.exit(1);
			}
		}

		if(shell.exec("gulp " + openwrapWebpackTaskName + " --mode=" + argv.mode).code !== 0) {
			shell.echo('Error: webpack wrapper task failed');
			shell.exit(1);
		}


		if(shell.exec("gulp " + openwrapBuildTaskName + " --mode=" + argv.mode).code !== 0) {
			shell.echo('Error: wrapper build task failed');
			shell.exit(1);
		}
}
