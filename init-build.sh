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
    echo " Provide type of build using -t flag"
    echo " Provide what to build using -w flag"
    echo " Example: ./init-build.sh -p \"../Prebid.js\" -m \"build\" -t amp -w creative"
    exit 1
fi

PLATFORM_DISPLAY="display"
PLATFORM_AMP="amp"

while getopts ":p:m:t:w:" opt; do
  case $opt in
    p) prebid_path="$OPTARG"
    ;;
    m) mode="$OPTARG"
    ;;
    t) platform="$OPTARG"
    ;;
    w) task="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done


if [ -z $mode ]
  then
        echo "Please provide appropriate mode argument "
        exit 1
fi


if [ -z $prebid_path ]
then
      echo "Please provide appropriate Prebid.js repo path "
      exit 1
fi

OpenWrapNodeModules="${GLOBAL_OPENWRAP_PKG_JSON_DIR_V1_36_0}/node_modules/"


function prebidNpmInstall() {

  cd $1

  PrebidJSNodeModules="${GLOBAL_PREBID_PKG_JSON_DIR_V1_36_0}/node_modules/"

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


if [ "$platform" = "$PLATFORM_DISPLAY" ] || [ -z $platform ]
  then
    echo "Building for Display"
    ./build.sh --prebidpath=$prebid_path --mode=$mode

elif [ "$platform" = "$PLATFORM_AMP" ]
   then
   if [ -z $task ]
    then
        echo "Please provide appropriate task argument."
        exit 1
    fi
      echo "Building for AMP"
      ./build.sh --task=$task --mode=$mode
else
  echo "None"
fi
