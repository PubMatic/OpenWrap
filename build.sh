#! /usr/bin/env node
console.log("running from shell script");
var shell = require('shelljs');
var argv = require('yargs').argv;
var config = require("./src_new/config.js");
var prebidRepoPath = argv.prebidpath || "../Prebid.js/";
var task = argv.task || "wrapper";

console.log("ARGV ==>", argv);

var prebidTaskName = "";
var openwrapBuildTaskName = "";
var openwrapWebpackTaskName = "";
var CREATIVE_TASK = "creative";
var profileMode = "--profile="+(argv.profile == undefined ? "OW" : argv.profile);

if (task == CREATIVE_TASK) {
		console.log("inside creative");
		console.time("Cleaning Gulp");
		shell.exec("gulp clean");
		console.timeEnd("Cleaning Gulp");
		if (shell.exec("gulp webpack-creative --mode=" + argv.mode).code !== 0) {
			shell.echo('Error: webpack bundle and dist creative task failed');
			shell.exit(1);
		}

		if (shell.exec("gulp bundle-creative --mode=" + argv.mode).code !== 0) {
			shell.echo('Error:creative build task failed');
			shell.exit(1);
		}
} else {

		console.log("Switching To Build Task");
		if (shell.cd(prebidRepoPath).code !== 0) {
			shell.echo("Couldnt change the dir to Prebid repo");
			shell.exit(1);
		}
		if (argv.mode){
		 switch (argv.mode) {
			 case "test-build":
				console.log("Executing test-build");
				prebidTaskName = "build-bundle-dev --modules=modules.json "+profileMode;
				openwrapBuildTaskName = "devbundle";
				openwrapWebpackTaskName = "devpack";
				break;
		 	case  "dev-build":
				console.log("Executing build");
				prebidTaskName = "build --modules=modules.json "+profileMode;
				openwrapBuildTaskName = "bundle";
				openwrapWebpackTaskName = "webpack";
				break;
		 	case "build" :
				console.log("Executing build");
				if(!prebidTaskName){
					prebidTaskName = "bundle --modules=modules.json "+profileMode;
				}
				openwrapBuildTaskName = "bundle-prod";
				openwrapWebpackTaskName = "webpack";
				break;
			case "build-all" :
				console.log("Executing build");
				prebidTaskName = "build-bundle-dev --modules=modules.json "+profileMode;
				openwrapBuildTaskName = "devbundle";
				openwrapWebpackTaskName = "devpack";
			break;	
			default:
				console.log("No mode supplied, Too few arguments");
				shell.exit(1);
				break;
			}
		}
		else {
				console.log("No mode supplied, Too few arguments");
				shell.exit(1);
		}

		console.time("Executing Prebid Build");
		if(shell.exec("time gulp " + prebidTaskName + " --mode=" + argv.mode).code !== 0) {
			shell.echo('Error: buidlinng of project failed');
		  	shell.exit(1);
		}
		console.timeEnd("Executing Prebid Build");
		
		shell.cd("../OpenWrap/");
		if (argv.mode == "test-build") {
			if(shell.exec("gulp testall" + " --mode=" + argv.mode + " --prebidpath=" + prebidRepoPath).code !== 0) {
				shell.echo('Error: test cases failed');
		  		shell.exit(1);
			}
		} 

		console.time("Cleaning Gulp");
		// shell.exec("gulp clean");
		console.timeEnd("Cleaning Gulp");
		/*if(shell.exec("gulp " + openwrapWebpackTaskName + " --mode=" + argv.mode + " --prebidpath=" + prebidRepoPath).code !== 0) {
			shell.echo('Error: webpack wrapper task failed');
			shell.exit(1);
		}*/


		if(shell.exec("time gulp " + openwrapBuildTaskName + " --mode=" + argv.mode + " " + profileMode + " --prebidpath=" + prebidRepoPath).code !== 0) {
			shell.echo('Error: wrapper build task failed');
			shell.exit(1);
		}

		if(config.isUsePrebidKeysEnabled() === false && config.isPrebidPubMaticAnalyticsEnabled() === true){
			console.log("We need to use PWT keys, so changing targeting keys in PrebidJS config");
			prebidTaskName = "build-bundle-prod --modules=modules.json";
			if(shell.exec("time gulp bundle-pwt-keys").code !== 0) {
				shell.echo('Error: Changing PrebidJS targeting keys failed');
			  	shell.exit(1);
			}
		} else {
			console.log("We need to use Prebid keys, so changing targeting keys in PrebidJS config");
			if(shell.exec("time gulp bundle-pb-keys").code !== 0) {
				shell.echo('Error: Changing PrebidJS targeting keys failed');
			  	shell.exit(1);
			}		
		}
		if(config.isUsePrebidKeysEnabled() === true){
			console.log("We need to use Prebid keys for Native, so changing targeting keys in PrebidJS config");
			prebidTaskName = "build-bundle-prod --modules=modules.json";
			if(shell.exec("time gulp bundle-native-pb-keys").code !== 0) {
				shell.echo('Error: Changing PrebidJS targeting keys for Native failed');
			  	shell.exit(1);
			}
		} else {
			console.log("We need to use PWT keys for Native, so changing targeting keys in PrebidJS config");
			if(shell.exec("time gulp bundle-native-pwt-keys").code !== 0) {
				shell.echo('Error: Changing PrebidJS targeting keys for Native failed');
			  	shell.exit(1);
			}
		}
		console.log("Executing update-namespace task if identityOnly = 1, => ", config.isIdentityOnly());
		if(config.isIdentityOnly()) {
			console.log("Updating owpbjs namespace to use ihowpbjs for identity only profiles");
			if(shell.exec("time gulp update-namespace").code !== 0) {
				shell.echo('Error: Changing owpbjs namespace to use ihowpbjs failed');
				shell.exit(1);
			}
		}
}
