#! /usr/bin/env node
cd ../Prebid.js/

gulp webpack

cd ../OpenWrap/

cp ../Prebid.js/build/dist/prebid.js .

gulp buildcerebro