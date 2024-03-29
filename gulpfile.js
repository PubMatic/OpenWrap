'use strict';
console.time("Loading plugins OW");
var argv = require('yargs').argv;
var gulp = require('gulp');
var replace = require('gulp-replace-task');
var config = require("./src_new/config.js");
var eslint = require('gulp-eslint');
console.timeEnd("Loading plugins OW");
var CI_MODE = (argv.mode === 'test-build') ? true : false;
var isIdentityOnly = config.isIdentityOnly();
var profileMode = argv.profile;
console.log("In openwrap gulp.sh profileMode = " + profileMode);
console.log("argv ==>", argv);

var prebidRepoPath = argv.prebidpath || "../Prebid.js/";
//console.log("@@@@@@@@@@@@ prebidRepoPath = ",prebidRepoPath);

gulp.task('update-adserver', async function() {
    console.log("In update-adserver isIdentityOnly = " + isIdentityOnly);
    if (isIdentityOnly) {
        console.log("Executing update-adserver - START");
        var result = gulp.src(['./src_new/conf.js'])
          .pipe(replace({
            patterns: [
              {
                match: /['"]*adserver['"]*:[\s]*['"]*DFP['"]*/,
                replacement: '"adserver": "IDHUB"'
              }
            ]
          }))
          .pipe(gulp.dest('./src_new/'));
        console.log("Executing update-adserver - END");
        return result;
    }
});

gulp.task('clean', gulp.series('update-adserver', function() {
    var clean = require('gulp-clean');
    return gulp.src(['dist/**/*.js', 'build/'], {
            read: false,
            allowEmpty: true
        })
        .pipe(clean());
}));

function getRemoveCodeConfig(){

    //var config = require("./src_new/config.js");
    
    // a controlled way to completely disable this feature
    if(config.isReduceCodeSizeFeatureEnabled() === false){
        return {};    
    }

    // Here we will define the flags/tags that we need to use in code comments
    //todo: set these all to false by default
    var removeCodeConfig = {
        removeAlways: true, // some code that should never be part of the final build
        removeLegacyAnalyticsRelatedCode: false, // Condition -> (config.isIdentityOnly() === true || config.isPrebidPubMaticAnalyticsEnabled()===true)
        removeNativeRelatedCode: false, //TODO: Make this flags as true based on conditions of slot config
        removeInStreamRelatedCode: false,//TODO: Make this flags as true based on conditions of slot config
        removeOutStreamRelatedCode: false,//TODO: Make this flags as true based on conditions of slot config
        removeUserIdRelatedCode: false, // Condition -> (config.isUserIdModuleEnabled()===false)
        removeIdHubOnlyRelatedCode: (isIdentityOnly===false)
    };

    return removeCodeConfig; // todo: only for dev purpose; remove later
}

// What all processing needs to be done ?
gulp.task('webpack', gulp.series('clean', function() {
    //var config = require("./src_new/config.js");
    console.log("Executing webpack");
    var connect = require('gulp-connect');
    var uglify = require('gulp-uglify');
    var webpack = require('webpack-stream');
    var webpackConfig = require('./webpack.config.js');
    var optimizejs = require('gulp-optimize-js');
    var fsCache = require('gulp-fs-cache');
    var removeCode = require('gulp-remove-code');
    var jsFsCache = fsCache('.tmp/jscache');
    webpackConfig.devtool = false;

    return gulp.src(isIdentityOnly ? 'src_new/idhub.js' : 'src_new/owt.js', {"allowEmpty": true})
    // return gulp.src('src_new/owt.js')
        .pipe(webpack(webpackConfig))
        .pipe(jsFsCache)
        .pipe(removeCode(getRemoveCodeConfig()))
        .pipe(uglify())
        .pipe(optimizejs())
        .pipe(jsFsCache.restore)
        .pipe(gulp.dest('build/dist'))
        .pipe(connect.reload())
    ;
}));

// Run below task to create owt.js for creative
gulp.task('webpack-creative', gulp.series('clean', function() {
    var connect = require('gulp-connect');
    var uglify = require('gulp-uglify');
    var webpack = require('webpack-stream');
    var webpackConfig = require('./webpack.config.js');
    var optimizejs = require('gulp-optimize-js');
    webpackConfig.devtool = false;

    return gulp.src('src_new/creative/owCreativeRenderer.js')
        .pipe(webpack(webpackConfig))
        .pipe(uglify())
        .pipe(optimizejs())
        .pipe(gulp.dest('build/dist'))
        .pipe(connect.reload())
    ;
}));


gulp.task('devpack', gulp.series('clean', function () {
    //var config = require("./src_new/config.js");
    var connect = require('gulp-connect');
    var webpack = require('webpack-stream');
    var removeCode = require('gulp-remove-code');
    var webpackConfig = require('./webpack.config.js');

    webpackConfig.devtool = 'source-map';

    return gulp.src(isIdentityOnly ? 'src_new/idhub.js' : 'src_new/owt.js', {"allowEmpty": true})
    // return gulp.src('src_new/owt.js')
        .pipe(webpack(webpackConfig))
        .pipe(removeCode(getRemoveCodeConfig()))
        .pipe(gulp.dest('build/dev'))
        .pipe(connect.reload());
}));

// Task to remove privately exposed functions as well as remove test cases which test private functions
gulp.task('unexpose', function() {
    var stripCode = require('gulp-strip-code');
    
    return gulp
        .src([
            'src_new/**/*.js',
            'test/**/*.js'
            ],
            { base: './' }
        )
        .pipe(stripCode({
            start_comment: "start-test-block",
            end_comment: "end-test-block"
        }))
        .pipe(gulp.dest('./temp/'));
});


// Test all code without private functions
gulp.task('test', gulp.series('unexpose', async function (done) {
    // var karma = require('gulp-karma');
    var karmaServer = require('karma').Server;

    var defaultBrowsers = CI_MODE ? ['PhantomJS'] : ['Chrome'];
    new karmaServer({
        browsers: defaultBrowsers,
        basePath: './temp',
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function (exitCode) {
        console.log("exitCode ==>", exitCode);
        gulp.src('temp', {
            read: true
        })
        .pipe(clean())
        .pipe(function () {
            if (exitCode != 0) {
                process.exit(exitCode);
            }
        });
    }).start();
}));


// Test all code including private functions
gulp.task('testall', async function (done) {
    // var karma = require('gulp-karma');
    var karmaServer = require('karma').Server;
    var defaultBrowsers = CI_MODE ? ['PhantomJS'] : ['Chrome'];
    new karmaServer({
        browsers: defaultBrowsers,
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function (exitCode) {
        console.log("exitCode ==>", exitCode);
        if (exitCode != 0) {
            process.exit(exitCode);
        }
    }).start();
});


// Small task to load coverage reports in the browser
gulp.task('coverage', function (done) {
    var connect = require('gulp-connect');
    var opens = require('open');

    var coveragePort = 1999;
    connect.server({
        port: 1999,
        root: 'build',
        livereload: false
    });
    opens('http://localhost:' + coveragePort + '/coverage/');
    done();
});


// Code linting with eslint
gulp.task('lint', () => {
  return gulp.src([
        'src_new/**/*.js',
        'test/**/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format('stylish'))
    .pipe(eslint.failAfterError());
});

gulp.task('change-prebid-keys', function() {
    // Note: we have to execute this only when we have to use PubMatic OW keys
    // todo: add gulp-json-editor entry in package.json and in backend build job?
    var prebidConstantsPath = prebidRepoPath + '/src';
    var jeditor = require("gulp-json-editor");
    return gulp.src(prebidConstantsPath + '/constants.json')
        .pipe(jeditor(function(json) {
            json.TARGETING_KEYS.BIDDER = "pwtpid"; // hb_bidder
            json.TARGETING_KEYS.AD_ID = "pwtsid"; // hb_adid
            json.TARGETING_KEYS.PRICE_BUCKET = "pwtecp"; // hb_pb
            json.TARGETING_KEYS.SIZE = "pwtsz"; // hb_size
            json.TARGETING_KEYS.DEAL = "pwtdeal"; // hb_deal
            json.TARGETING_KEYS.SOURCE = ""; // hb_source
            json.TARGETING_KEYS.FORMAT = "pwtplt"; // hb_format
            json.TARGETING_KEYS.UUID = ""; // hb_uuids
            json.TARGETING_KEYS.CACHE_ID = "pwtcid"; // hb_cache_id
            json.TARGETING_KEYS.CACHE_HOST = ""; // hb_cache_host
            return json;
        }))
        .pipe(gulp.dest(prebidConstantsPath));
});

// Task to build minified version of owt.js
gulp.task('bundle', gulp.series('update-adserver', function () {
    console.log("Executing build");
    var concat = require('gulp-concat');
    var prebidFileName = (profileMode === "IH" ? '/build/dist/prebid.idhub.js' : '/build/dist/prebid.js')
    var prependscript = "", appendScript = "";
    console.log("profile mode = ", profileMode, " and isIdentityOnly = ", isIdentityOnly);
    if (isIdentityOnly) {
        prependscript = "src_new/ih_header.js";
        appendScript = "src_new/ih_footer.js";
        console.log("#### prepending script for identity only profile ", prependscript);
    }
    console.log("##################### prebidfilename picked = "+prebidFileName);
    return gulp.src([prependscript, prebidRepoPath + prebidFileName, './build/dist/owt.js', appendScript], { "allowEmpty": true })
        .pipe(concat('owt.min.js'))
        .pipe(gulp.dest('build'));
}));

gulp.task('bundle-pb-keys', function(){
      return gulp.src('./build/owt.min.js', {"allowEmpty": true})
      .pipe(replace({
        patterns: [
          {
            match: /"%%TG_KEYS%%"/g,
            replacement: {
                        "BIDDER": "hb_bidder",
                        "AD_ID": "hb_adid",
                        "PRICE_BUCKET": "hb_pb",
                        "SIZE": "hb_size",
                        "DEAL": "hb_deal",
                        "SOURCE": "hb_source",
                        "FORMAT": "hb_format",
                        "UUID": "hb_uuid",
                        "CACHE_ID": "hb_cache_id",
                        "CACHE_HOST": "hb_cache_host",
                        "ADOMAIN" : "hb_adomain"
                }
          }
        ]
      }))
      .pipe(gulp.dest('build'));
});

gulp.task('bundle-native-pb-keys', function(){
    return gulp.src('./build/owt.min.js', {"allowEmpty": true})
    .pipe(replace({
      patterns: [
        {
          match: /"%%TG_NATIVE_KEYS%%"/g,
          replacement: {
              "title": "hb_native_title",
              "body": "hb_native_body",
              "body2": "hb_native_body2",
              "privacyLink": "hb_native_privacy",
              "privacyIcon": "hb_native_privicon",
              "sponsoredBy": "hb_native_brand",
              "image": "hb_native_image",
              "icon": "hb_native_icon",
              "clickUrl": "hb_native_linkurl",
              "displayUrl": "hb_native_displayurl",
              "cta": "hb_native_cta",
              "rating": "hb_native_rating",
              "address": "hb_native_address",
              "downloads": "hb_native_downloads",
              "likes": "hb_native_likes",
              "phone": "hb_native_phone",
              "price": "hb_native_price",
              "salePrice": "hb_native_saleprice",
              "rendererUrl": "hb_renderer_url",
              "adTemplate": "hb_adTemplate",
          }
        }
      ]
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('bundle-pwt-keys', function(){
      return gulp.src('./build/owt.min.js', {"allowEmpty": true})
      .pipe(replace({
        patterns: [
          {
            match: /"%%TG_KEYS%%"/g,
            replacement: { 
                "STATUS": "pwtbst",
                "BIDDER": "pwtpid",
                "AD_ID": "pwtsid",
                "PRICE_BUCKET": "pwtecp",
                "SIZE": "pwtsz",
                "DEAL": "pwtdeal",
                "DEAL_ID": "pwtdid",
                "SOURCE": "",
                "FORMAT": "pwtplt",
                "UUID": "pwtuuid",
                "CACHE_ID": "pwtcid",
                "CACHE_HOST": "pwtcurl",
                "ADOMAIN" : "pwtadomain"
            }
          }
        ]
      }))
      .pipe(gulp.dest('build'));
});

gulp.task('bundle-native-pwt-keys', function(){
    return gulp.src('./build/owt.min.js', {"allowEmpty": true})
    .pipe(replace({
      patterns: [
        {
          match: /"%%TG_NATIVE_KEYS%%"/g,
          replacement: { 
              "title": "pwt_native_title",
              "body": "pwt_native_body",
              "body2": "pwt_native_body2",
              "privacyLink": "pwt_native_privacy",
              "sponsoredBy": "pwt_native_brand",
              "image": "pwt_native_image",
              "icon": "pwt_native_icon",
              "clickUrl": "pwt_native_linkurl",
              "displayUrl": "pwt_native_displayurl",
              "cta": "pwt_native_cta",
              "rating": "pwt_native_rating",
              "address": "pwt_native_address",
              "downloads": "pwt_native_downloads",
              "likes": "pwt_native_likes",
              "phone": "pwt_native_phone",
              "price": "pwt_native_price",
              "salePrice": "pwt_native_saleprice"
          }
        }
      ]
    }))
    .pipe(gulp.dest('build'));
});

// Task to build minified version of owt.js
gulp.task('bundle-creative', function () {
    console.log("Executing creative-build");
    var concat = require('gulp-concat');
    return gulp.src(['./build/dist/owt.js'])
        .pipe(concat('owt.min.js'))
        .pipe(gulp.dest('build'));
});


// Task to build non-minified version of owt.js
gulp.task('devbundle', gulp.series('devpack', function () {
    console.log("Executing Dev Build");
    var concat = require('gulp-concat');
    // var prebidFileName = (profileMode === "IH" ? '/build/devIH/prebid.idhub.js' : '/build/dev/prebid.js')
    var prebidFileName = '/build/dev/prebid.js';
    console.log("##################### prebidfilename picked = "+prebidFileName);
    return gulp.src([prebidRepoPath + prebidFileName, './build/dev/owt.js'])
        .pipe(concat('owt.js'))
        .pipe(gulp.dest('build'));
}));


gulp.task('bundle-prod', gulp.series('webpack', function () {
    console.log("Executing bundling");
    var concat = require('gulp-concat');
    // var prebidFileName = (profileMode === "IH" ? '/build/distIH/prebid.idhub.js' : '/build/dist/prebid.js')
    var prebidFileName = '/build/dist/prebid.js';
    var prependscript = "", appendScript = "";
    var sources = [prebidRepoPath + prebidFileName, './build/dist/owt.js'];
    console.log("profile mode = ", profileMode, " and isIdentityOnly = ", isIdentityOnly);
    if (isIdentityOnly) {
        prependscript = "src_new/ih_header.js";
        appendScript = "src_new/ih_footer.js";
        console.log("#### prepending script for identity only profile ", prependscript);
        sources = [prependscript, prebidRepoPath + prebidFileName, './build/dist/owt.js', appendScript];
    }
    console.log("##################### prebidfilename picked = "+prebidFileName);
    return gulp.src(sources, { "allowEmpty": true })
        .pipe(concat('owt.min.js'))
        .pipe(gulp.dest('build'));
}));

gulp.task('build-gpt-prod');
