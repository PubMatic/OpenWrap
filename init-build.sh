#!/bin/bash

# Steps
# run sym links for node_modules folder
# run npm install in current directory i.e. OpenWrap repo
# run npm install in Prebid.js repo ( accept path for the same ? )
# run build.sh with arguments accepted while executing this script

if [ $# -eq 0 ]
  then
    echo " No arguments supplied"
    echo " Provide prebid repo path using -p flag"
    echo " Provide build mode using -m flag"
    echo " Example: ./init-build.sh -p \"../Prebid.js\" -m \"build\" -t amp"
    exit 1
fi

while getopts ":p:m:t:" opt; do
  case $opt in
    p) prebid_path="$OPTARG"
    ;;
    m) mode="$OPTARG"
    ;;
    t) platform="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

if [ -z $prebid_path ]
  then
        echo "Please provide appropriate Prebid.js repo path "
        exit 1
fi

if [ -z $mode ]
  then
        echo "Please provide appropriate mode argument "
        exit 1
fi

if [ -z $platform ]
  then
        echo "Please provide appropriate platform argument "
        exit 1
fi

if [ "$platform" = "display" ]
  then
OpenWrapNodeModules="${GLOBAL_OPENWRAP_PKG_JSON_DIR_V1_11}/node_modules/"


function prebidNpmInstall() {

  cd $1

  PrebidJSNodeModules="${GLOBAL_PREBID_PKG_JSON_DIR_V1_11}/node_modules/"

  symLinkForPrebidNodeModules=node_modules
  if [ -L $symLinkForPrebidNodeModules ]; then
    unlink $symLinkForPrebidNodeModules
  fi

  ln -s "$PrebidJSNodeModules" "./node_modules"

 # npm install

  cd ../OpenWrap/
}

  symLinkForOpenWrapNodeModules=node_modules
  if [ -L $symLinkForOpenWrapNodeModules ]; then
    unlink $symLinkForOpenWrapNodeModules
  fi

ln -s "$OpenWrapNodeModules" "./node_modules"

# echo //ci.pubmatic.com:4873/:_authToken=WeepY06w3S9VfbF4gdm42piZepf9+95zj7dd1AEtAVcfuW0S9u5COPSVS5K39CSF > .npmrc
# npm install uas-adclient@0.0.1-master.13 --registry=http://ci.pubmatic.com:4873 --save
#
# npm install

prebidNpmInstall $prebid_path

./build.sh --prebidpath=$prebid_path --mode=$mode

elif [ "$platform" = "amp" ]
   then
      echo "Building for AMP"
      ./build.sh --codeType=creative
else 
  echo "None"
fi