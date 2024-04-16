'use strict';
console.time("Loading plugins OW");
var argv = require('yargs').argv;
var gulp = require('gulp');
var replace = require('gulp-replace-task');
var eslint = require('gulp-eslint');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var webpack = require('webpack-stream');
var optimizejs = require('gulp-optimize-js');
var fsCache = require('gulp-fs-cache');
var removeCode = require('gulp-remove-code');
const fs = require('fs');

console.timeEnd("Loading plugins OW");
var CI_MODE = (argv.mode === 'test-build') ? true : false;
var profileMode = argv.profile;
console.log("In openwrap gulp.sh profileMode = " + profileMode);
console.log("argv ==>", argv);

var prebidRepoPath = argv.prebidpath || "../Prebid.js/";

var OWTdestPaths = {
	IDHUB: "build/dist/ID",
	DFP: "build/dist/dfp",
	CUSTOM: "build/dist/custom",
    AMP: "build/dist/dfp"
};

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

gulp.task('clean', gulp.series(function() {
    var clean = require('gulp-clean');
    return gulp.src(['dist/**/*.js', 'build/'], {
            read: false,
            allowEmpty: true
        })
        .pipe(clean());
}));

function getRemoveCodeConfig(isIdentityOnly = false) {
    var config = require("./src_new/config.js");
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

    // var slotConfig = config.getSlotConfiguration();
    // if(!slotConfig){
    //     removeCodeConfig.removeNativeRelatedCode = true;
    //     removeCodeConfig.removeOutStreamRelatedCode = true;
    //     removeCodeConfig.removeInStreamRelatedCode = true;
    // } else {
    //     //todo: Add logic to set the flags by checking the config
    //     //      might be a case where only one of these is enabled: Native, in-stream or out-stream
    // }    

    // return removeCodeConfig;
}

// What all processing needs to be done ?
gulp.task('webpack', gulp.series('clean', function() {
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

    return gulp.src(isIdentityOnly ? 'src_new/idhub.js' : 'src_new/owt.js', { allowEmpty: true })
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

gulp.task('buildDFP', gulp.series(function() {
    console.log("Executing buildDFP");
    var _ = require('lodash');

    var jsFsCache = fsCache('.tmp/jscache');
    var webpackConfig = require('./webpack.config.js')('DFP');
    var cloned = _.cloneDeep(webpackConfig);
    cloned.devtool = false;

    return gulp.src('src_new/owt.js', { allowEmpty: true })
        .pipe(webpack(cloned))
        .pipe(jsFsCache)
        .pipe(removeCode(getRemoveCodeConfig()))
        .pipe(uglify())
        .pipe(optimizejs())
        .pipe(jsFsCache.restore)
        .pipe(gulp.dest(OWTdestPaths.DFP))
        .pipe(connect.reload())
    ;
}));

gulp.task('buildCustom', gulp.series(function() {
    console.log("Executing buildCustom");
    var _ = require('lodash');

    var jsFsCache = fsCache('.tmp/jscache');
    var webpackConfig = require('./webpack.config.js')('CUSTOM');
    var cloned = _.cloneDeep(webpackConfig);
    cloned.devtool = false;

    return gulp.src('src_new/owt.js', { allowEmpty: true })
        .pipe(webpack(cloned))
        .pipe(jsFsCache)
        .pipe(removeCode(getRemoveCodeConfig()))
        .pipe(uglify())
        .pipe(optimizejs())
        .pipe(jsFsCache.restore)
        .pipe(gulp.dest(OWTdestPaths.CUSTOM))
        .pipe(connect.reload())
    ;
}));

gulp.task('buildID', gulp.series(function() {
    console.log("Executing buildID");
    var _ = require('lodash');

    var jsFsCache = fsCache('.tmp/jscache');
    var webpackConfig = require('./webpack.config.js')('IDHUB');
    var cloned = _.cloneDeep(webpackConfig);
    cloned.devtool = false;

    return gulp.src('src_new/idhub.js', { allowEmpty: true })
        .pipe(webpack(cloned))
        .pipe(jsFsCache)
        .pipe(removeCode(getRemoveCodeConfig(true)))
        .pipe(uglify())
        .pipe(optimizejs())
        .pipe(jsFsCache.restore)
        .pipe(gulp.dest(OWTdestPaths.IDHUB))
        .pipe(connect.reload())
    ;
}));

gulp.task('buildOW', gulp.series('clean', 'buildDFP', 'buildCustom', 'buildID'));

gulp.task('replaceMacroWithConfigurations', function() {
    console.log("Replacing macro with configs");
    const pwt = fs.readFileSync("src_new/pwt", 'utf8');
    const testConfigDetails = fs.readFileSync("src_new/testConfigDetails", 'utf8');
    const testpwt = fs.readFileSync("src_new/testpwt", 'utf8');
    const adapters = fs.readFileSync("src_new/adapter", 'utf8');
    const identityPartners = fs.readFileSync("src_new/identityPartners", 'utf8');
    const slotConfig = fs.readFileSync("src_new/slotConfig", 'utf8');

    console.log("-------- PWT ", pwt);
    console.log("-------- PWT ", typeof pwt);
    console.log("-------- PWT ", JSON.parse(pwt));

    const owtPath = OWTdestPaths[argv.adserver || "DFP"];
    console.log("owtPath ", owtPath);
    return gulp.src(owtPath + "/owt.js", { "allowEmpty": true })
    .pipe(replace({
        patterns: [
            {match: /"%%REPLACE_PWT%%"/g, replacement: pwt},
            {match: /"%%REPLACE_TESTCONFIGDETAILS%%"/g, replacement: testConfigDetails},
            {match: /"%%REPLACE_TEST_PWT%%"/g, replacement: testpwt},
            {match: /"%%REPLACE_ADAPTERS%%"/g, replacement: adapters},
            {match: /"%%REPLACE_IDENTITYPARTNERS%%"/g, replacement: identityPartners},
            {match: /"%%REPLACE_SLOTCONFIG%%"/g, replacement: slotConfig}
        ]
    }))
    .pipe(gulp.dest(owtPath));
});

gulp.task('replaceConfWithMacro', function() {
    console.log("Replacing conf with macro");
    const filePath = "src_new/macro.js";
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return gulp.src("src_new/conf.js", { "allowEmpty": true })
    .pipe(replace({
        patterns: [{
            match: /\/\*REPLACE_FROM_HERE_WITH_GULP\*\/([\s\S]*?)\/\*REPLACE_TILL_HERE_WITH_GULP\*\//g,
            replacement: fileContent
        }]
    }))
    .pipe(gulp.dest("src_new"));
});

// Run below task to create owt.js for creative
gulp.task('webpack-creative', gulp.series('clean', function() {
    var connect = require('gulp-connect');
    var uglify = require('gulp-uglify');
    var webpack = require('webpack-stream');
    var webpackConfig = require('./webpack.config.js')();
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
    var connect = require('gulp-connect');
    var webpack = require('webpack-stream');
    var removeCode = require('gulp-remove-code');
    //TODO read conf adserver and pass it to webpack config
    var webpackConfig = require('./webpack.config.js');
    //TODO assign proper value of identityonly from conf
    var isIdentityOnly = false;
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
    var karmaServer = require('karma').Server;

    var defaultBrowsers = CI_MODE ? ['ChromeHeadless'] : ['Chrome'];
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
    var karmaServer = require('karma').Server;
    var defaultBrowsers = CI_MODE ? ['ChromeHeadless'] : ['Chrome'];
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

gulp.task('change-prebid-keys', () => {
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
    //var prebidFileName = isIdentityOnly ? '/build/dist/prebidIdhub.js' : '/build/dist/prebid.js';
    var prebidFileName = '/build/dist/prebid.js';
    return gulp.src([prebidRepoPath + prebidFileName, './build/dist/owt.js'], { allowEmpty: true })    
        .pipe(concat('owt.min.js'))
        .pipe(gulp.dest('build'));
}));

gulp.task('bundle-pwt-keys', function() {
    var config = require("./src_new/config.js");
    if(config.isUsePrebidKeysEnabled() === false && config.isPrebidPubMaticAnalyticsEnabled() === true){
        console.log("We need to use PWT keys, so changing targeting keys in PrebidJS config");
        return gulp.src('./build/owt.min.js', { "allowEmpty": true })
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
    } else {
        console.log("We need to use Prebid keys, so changing targeting keys in PrebidJS config");
        return gulp.src('./build/owt.min.js', { "allowEmpty": true })
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
                    "ADOMAIN": "hb_adomain",
                    "ACAT": "hb_acat",
                    "CRID": "hb_crid",
                    "DSP": "hb_dsp"
                    }
                }
            ]
            }))
            .pipe(gulp.dest('build'));
    }
});

gulp.task('bundle-native-keys', function() {
    var config = require("./src_new/config.js");
    if(config.isUsePrebidKeysEnabled() === true) {
        console.log("We need to use Prebid keys for Native, so changing targeting keys in PrebidJS config");
        return gulp.src('./build/owt.min.js', { "allowEmpty": true })
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
    } else {
        console.log("We need to use PWT keys for Native, so changing targeting keys in PrebidJS config");
        return gulp.src('./build/owt.min.js', { "allowEmpty": true })
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
    }
});

gulp.task('bundle-keys', gulp.series('bundle-pwt-keys', 'bundle-native-keys'));

// Task to build minified version of owt.js
gulp.task('bundle-creative', function () {
    console.log("Executing creative-build");
    var concat = require('gulp-concat');
    return gulp.src(['./build/dist/owt.js'])
        .pipe(concat('owt.min.js'))
        .pipe(gulp.dest('build'));
});


// Task to build non-minified version of owt.js
gulp.task('devbundle', gulp.series('devpack', function (isIdentityOnly = false) {
    console.log("Executing Dev Build");
    var concat = require('gulp-concat');
    //var prebidFileName = isIdentityOnly ? '/build/dev/prebidIdhub.js' : '/build/dev/prebid.js';
    var prebidFileName = '/build/dev/prebid.js';
    var footerFileName = isIdentityOnly ? './src_new/ih_footer.js' : './src_new/ow_footer.js';
    return gulp.src([prebidRepoPath + prebidFileName, './build/dev/owt.js', footerFileName], { allowEmpty: true })
        .pipe(concat('owt.js'))
        .pipe(gulp.dest('build'));
}));

gulp.task('bundle-prod', gulp.series('webpack', function () {
    console.log("Executing bundling");
    var concat = require('gulp-concat');
    //var prebidFileName = isIdentityOnly ? '/build/dist/prebidIdhub.js' : '/build/dist/prebid.js';
    var prebidFileName = '/build/dist/prebid.js';
    var footerFileName = isIdentityOnly ? './src_new/ih_footer.js' : './src_new/ow_footer.js';
    return gulp.src([prebidRepoPath + prebidFileName, './build/dist/owt.js', footerFileName], { allowEmpty: true })
        .pipe(concat('owt.min.js'))
        .pipe(gulp.dest('build'));
}));

gulp.task('mybundle-prod', gulp.series(function (isIdentityOnly = false) {
    console.log("Executing bundling");
    var concat = require('gulp-concat');
    var prebidFileName = '/build/dist/prebid.js';
    var footerFileName = isIdentityOnly ? './src_new/ih_footer.js' : './src_new/ow_footer.js';
    return gulp.src([prebidRepoPath + prebidFileName, './build/dist/custom/owt.js', footerFileName], { allowEmpty: true })
        .pipe(concat('owt.min.js'))
        .pipe(gulp.dest('build'));
}));

function addPattern(patterns, match, replacement) {
    if (replacement) {
        patterns.push({
            match: match,
            replacement: replacement
        });
    }
}

function getPatternsToReplace() {
    var config = require("./src_new/config.js");
    const { COMMON, CONFIG } = require('./src_new/constants.js');
    var patterns = [];
    if (isIdentityOnly) {
        addPattern(patterns, /ihowpbjs|owpbjs/g, config.getOverrideNamespace(CONFIG.PB_GLOBAL_VAR_NAMESPACE, COMMON.IH_NAMESPACE, COMMON.IH_NAMESPACE));
        addPattern(patterns, /IHPWT/g, config.getOverrideNamespace(CONFIG.OW_GLOBAL_VAR_NAMESPACE, COMMON.IH_OW_NAMESPACE, null));
    } else {
        // Passing null as we don't want to replace the used value(i.e. PWT) with default value(i.e. PWT) as both are same,
        addPattern(patterns, /owpbjs/g, config.getOverrideNamespace(CONFIG.PB_GLOBAL_VAR_NAMESPACE, COMMON.PREBID_NAMESPACE, null));
        addPattern(patterns, /PWT/g, config.getOverrideNamespace(CONFIG.OW_GLOBAL_VAR_NAMESPACE, COMMON.OPENWRAP_NAMESPACE, null));
    }
    return patterns;
}

gulp.task('update-namespace', async function () {
    console.log("Executing update-namespace - START => ");
    var patternsToReplace = getPatternsToReplace();
    console.log("Patterns to replace => ", patternsToReplace);
    if (patternsToReplace.length > 0) {
        return gulp.src('build/*.js')
            .pipe(replace({
                patterns: patternsToReplace
            }))
            .pipe(gulp.dest('build'));
    } else {
        console.log("default namespaces(owpbjs and PWT) are using.");
    }
});

gulp.task('build-gpt-prod');

let tasks = argv.task ? [argv.task, 'bundle-keys'] : ['bundle-keys'];
gulp.task('build-bundle', gulp.series(tasks));
