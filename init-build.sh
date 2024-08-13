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
    echo " Provide the profile whether IH or OW using the -x flag"
    echo " Example: ./init-build.sh -p \"../Prebid.js\" -m \"build\" -t amp -w creative -x \"IH\" "
    exit 1
fi

PLATFORM_DISPLAY="display"
PLATFORM_AMP="amp"
echo "$(date) This is Reading Params"
while getopts ":p:m:t:w:x:" opt; do
  case $opt in
    p) prebid_path="$OPTARG"
    ;;
    m) mode="$OPTARG"
    ;;
    t) platform="$OPTARG"
    ;;
    w) task="$OPTARG"
    ;;
    x) profile="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done
echo "This is Reading Params Done"

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


OpenWrapNodeModules="${GLOBAL_OPENWRAP_PKG_JSON_DIR_V8_52_0}/node_modules/"


function prebidNpmInstall() {
  echo "This is SymLinking Start"
  cd $1



PrebidJSNodeModules="${GLOBAL_PREBID_PKG_JSON_DIR_V8_52_0}/node_modules/"


  symLinkForPrebidNodeModules=node_modules
  if [ -L $symLinkForPrebidNodeModules ]; then
    unlink $symLinkForPrebidNodeModules
  fi

  ln -s "$PrebidJSNodeModules" "./node_modules"

 # npm install

  cd ../OpenWrap/
  echo "This is SymLinking Stop"

}

  echo "This is SymLinking Start for OpenWrap"
  symLinkForOpenWrapNodeModules=node_modules
  if [ -L $symLinkForOpenWrapNodeModules ]; then
    unlink $symLinkForOpenWrapNodeModules
  fi

ln -s "$OpenWrapNodeModules" "./node_modules"
echo "This is SymLinking Start for Prebid"

# echo //ci.pubmatic.com:4873/:_authToken=WeepY06w3S9VfbF4gdm42piZepf9+95zj7dd1AEtAVcfuW0S9u5COPSVS5K39CSF > .npmrc
# npm install uas-adclient@0.0.1-master.13 --registry=http://ci.pubmatic.com:4873 --save
#
# npm install

prebidNpmInstall $prebid_path


if [ "$platform" = "$PLATFORM_DISPLAY" ] || [ -z $platform ]
  then
   time ./build.sh --prebidpath=$prebid_path --mode=$mode --profile=$profile

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
