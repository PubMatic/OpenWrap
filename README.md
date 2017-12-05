
# **Copyright**

Copyright 2017 PubMatic, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Portions of OpenWrap contain code from Prebid.js licensed under the
Apache License, Version 2.0.

# Introduction

OpenWrap is an extension of Prebid now (since version [6.1.0](https://github.com/PubMatic/OpenWrap/releases/tag/ExtPrebid_v6.1.0_NIGHTLY)) and uses Prebid as the core library for all partner integration.

Portions of OpenWrap contain code from Prebid.js licensed under the Apache License, Version 2.0.

As publishers have embraced header bidding, running multiple header tags from different providers has become a top priority with many considerations.

The main areas of concern are:

*   Code conflict
*   Inability to control timeouts efficiently
*   Development time required per integration
*   Lack of holistic insights and analytics
*   Changing the page and tag structure to accommodate for header tag.

We came up with a simple way to use wrapper tags which solves for all the issues above and most importantly, was specifically designed to be plug-and-play with the GPT tags. 

What this means for publishers:

*   No changes to GPT structure
*   No coding required to get and push bids to GPT (not even setting targeting)
*   Works with standard as well as advanced GPT implementations.

All the publisher has to do is push the wrapper script and partner configuration live on the page and you are done. It’s that simple. The script takes care of detecting what ad units, divs and sizes are on page, fire up calls to desired partners and attach bids to DFP calls as key-values.

# Design and Execution Flow

# <span style="font-size: 20.0px;line-height: 1.5;">Interaction with GPT tag</span>

*   Wrapper script interacts with GPT tags by overriding basic GPT functions like display(), refresh() ... 
*   The original display calls to DFP are put in queue until all the Wrapper partners are called for bid or desired timeout is reached.
*   Final auction between the bids takes place and the highest bid is pushed as key-value to DFP
*   Here is the flow diagram for someone who wants to have a look at the code and understands what is happening inside the hood.
  ![alt text](https://raw.githubusercontent.com/PubMatic/OpenWrap/master/images/OpenWrap-GPT.png "OpenWrap-GPT")


# Getting Started

Please note that, OpenWrap extending PreBid code is in ***src_new*** folder the code in original src folder is deprecated now and will eventually will be removed and replaced with code in src_new folder.

## PreBid Fork:

We have created a fork from PreBid repo: https://github.com/PubMatic-OpenWrap/Prebid.js which OpenWrap uses as core and is used for building the library.
The fork has PreBid Version [0.24.1](https://github.com/prebid/Prebid.js/releases/tag/0.24.1) which will be upgraded frquently to latest PreBid version. 

## Configuration Exchange between OpenWrap and Prebid

All partners from PreBid listed [here](http://prebid.org/dev-docs/bidders.html) can be used with OpenWrap. Refer [build](https://github.com/PubMatic-OpenWrap/Prebid.js#Build) section to configure adapters to use with PreBid.

Please refer [src_new/conf.js](https://github.com/PubMatic/OpenWrap/blob/ContinuousIntegration/src_new/conf.js) in OpenWrap code:

```
exports.pwt = {                                 // Start of PWT config
    t: "3000",                                    // This is the timeout for all partners
    pid: "46",                                    // Profile ID (optional and applicable for PubMatic analytics)
    gcv: "11",                                    // Global Code Version (optional and applicable for PubMatic analytics)
    pdvid: "4",                                   // Profile Display Version ID (optional and applicable for PubMatic analytics)
    pubid: "9999",                                // Publisher ID (optional and applicable for PubMatic platoform)
    dataURL: "t.youranalytics.com/logger?",               // End-point for logger pixel
    winURL: "t.youranalytics.com/tracker?"                // End-point for tracker pixel
};                                              // End of PWT config
 
exports.adapters = {                            // Start of Adapters config
 
    pubmatic: {                                 // PubMatic adapter
        rev_share: "0.0",                     // Revenue Share for PubMatic
        throttle: "100",                      // Throttling percentage, 100 means do not throttle
        publisherId: "9999",                  // PubMatic Publisher ID
        kgp: "_DIV_@_W_x_H_:_AUI_"                // KGP for PubMatic
    },                                          // End of PubMatic config
 
    appnexus: {                                 // AppNexus adapter
        rev_share: "0.0",                     // Revenue Share for AppNexus
        throttle: "100",                      // Throttling percentage, 100 means do not throttle
        kgp: "_DIV_",                         // KGP for AppNexus
        klm: {                                  // Key-Lookup-Map, KGPV, the value generated using KGP will be looked for into this map and respective config will be passed to PreBid
            "Div_1": {                            // KGPV: Div_1
                placementId: "8801674"            // AppNexus param: placementId
            },                                  // End of KGPV: Div_1
            "Div-2": {                            // KGPV: Div-2
                placementId: "8801685"            // AppNexus param: placementId
            }                                   // End of KGPV: Div-2
        }                                       // End of KLM
    },                                          // End of AppNexus config
 
    pulsepoint: {                               // PulsePoint adapter
        cp: "521732",                         // PulsePoint parameter cp, a partner level key, it will be copied at run-time to Prebid slot level configurations
        rev_share: "0.0",                     // Revenue Share for PulsePoint
        throttle: "100",                      // Throttling percentage, 100 means do not throttle
        kgp: "_DIV_",                         // KGP for PulsePoint
        klm: {                                  // // Key-Lookup-Map, KGPV, the value generated using KGP will be looked for into this map and respective config will be passed to PreBid
            "Div_1": {                            // KGPV: Div_1 
                ct: "76835"                       // PulsePoint param: ct
            },                                  // End of KGPV: Div_1
            "Div-2": {                            // KGPV: Div-2
                ct: "147007"                  // PulsePoint param: ct
            }                                   // End of KGPV: Div-2
        }                                       // End of KLM
    }                                           // End of PulsePoint config
 
};                                              // End of Adapters config
```


## Default PreBid settings

*   Namespace: window.pbjs0 , namepaces will be generated dynamically everytime we call requestBids API, example: pbjs0, pbjs1 and so on.
*   Bidder Sequence: random
*   Logging: false by default, will be set to true if pwtvc/pwtc is used in page URL

## PreBid  API's used:

*   `window.pbjs.setBidderSequence("random");`
*   `window.pbjs.logging = false;`
*   `window.pbjs.requestBids({...});`
*   `window.pbjs.onEvent('bidResponse', function(bid){});`

## Supporting Advanced GPT setup
Advanced GPT implementation where publishers define and display slot on the fly WAS NOT supported due to PreBid [limitation](https://github.com/prebid/Prebid.js/issues/914)
Now we create Prebid namespaces at run time every time we need to call requestBids() API. As the requestBids() API method in two different namespace does not wait for call to complete execution. So for first call namespace would be pbjs0 , for second call namespace would be pbjs1 and so on. Due to creating multiple namespaces, Prebid's debug script may not work. 

## Logging Post-timeout bids
We use the event, bidResponse, provided by Prebid.
pbjs.onEvent('bidResponse', function(bid){}); gets bid from every partner even it comes post timeout. Please note that only the bids coming before TIMEOUT + 2 seconds will be logged in logger pixel.


### Combinations of KGP to PreBid code:

For a slot with,
*   AdUnit ID: /43743431/DMDemo1
*   AdUnit Index: 0
*   Sizes: [[300, 250],[728,90],[160, 600]]
*   Div ID: Top_Banner_1

There is a partners configured, AppNexus
Following are the different cases of KGP and code value:

| Index | Mapping Template | OpenWrap KGP | OpenWrap KGP Example | PreBid Code | PreBid Code Example |
| --- | --- | --- | --- | --- | --- |
|1|Div Level|`_DIV_`|`Top_Banner_1`|`_DIV_@_AdapterID_`|`Top_Banner_1@appnexus`|
|2|AdUnit-Size |`_AU_@_W_x_H_:_AUI_`|`/43743431/DMDemo1@300x250:0`  `/43743431/DMDemo1@728x90:0` `/43743431/DMDemo1@160x600:0`|`_DIV_@_AdapterID_@_Width_x_Height_`|`Top_Banner_1@appnexus@300x250` `Top_Banner_1@appnexus@728x90` `Top_Banner_1@appnexus@160x600`|
|3|Div-Size |`_DIV_@_W_x_H_`|`Top_Banner_1@300x250` `Top_Banner_1@728x90` `Top_Banner_1@160x600`|`_DIV_@_AdapterID_@_Width_x_Height_`|`Top_Banner_1@appnexus@300x250`  `Top_Banner_1@appnexus@728x90` `Top_Banner_1@appnexus@160x600`|
|4|Size|`_W_x_H_@_W_x_H_`|`300x250@300x250` `728x90@728x90` `160x600@160x600`|`_DIV_@_AdapterID_@_Width_x_Height_`|`Top_Banner_1@appnexus@300x250`  `Top_Banner_1@appnexus@728x90` `Top_Banner_1@appnexus@160x600`|


## How To Build

Building process of OpenWrap and Prebid.js has been automated with shell script named build.sh/build.cmd.
Please use shell script for the same with desired mode and parameters supported.
Shell script to execute gulp job :
*   For Unix: build.sh
*   For Windows: build.cmd

This particular shell script named "build.sh" or "build.cmd" can be triggered to generate OpenWrap distribution. Output file will be at path /build/owt.js
It accepts two parameters - 

*   **mode**: Its value can be either "build" or "test-build" .
    On passing the mode parameter with value "build", the shell script will generate production ready code , without running tests.
    On the other hand when mode parameter has "test-build" value, the shell script will run tests along with generation of dev version of the build.

*   **prebidpath**: This should be the relative path of Prebid repo on local machine.

Tools Required to build:
```
npm install gulp -g
npm install gulp-cli -g
```

Then chekout Prebid (currently fork of v0.24 is supported) on desired location:
```
git clone https://github.com/PubMatic-OpenWrap/Prebid.js
```
Run npm install in Prebid as well as OpenWrap Folder


Build with test:
```
./build.sh --mode=test-build --prebidpath=../Prebid.js/
```
Build for production:
```
./build.sh --mode=build --prebidpath=../Prebid.js/
```


## Deploy

The generated script should be deployed on a test page before trying it on production.
You can load the generated minimized js either synchronously or asynchronously on your pages.
To load minimized js synchronously, you can use below tag in the header section of your test page-

    <script type="text/javascript" src="/js/owt.combine.min.js"></script>


And to load minimized wrapper js script asynchronously before GPT using callback, you can use below tag-

    <!--GPT Tag with Callback begins here -->
    <script type="text/javascript">
        var PWT = {}; //Initialize Namespace
        var googletag = googletag || {};
        googletag.cmd = googletag.cmd || [];
        PWT.jsLoaded = function() { // Wrapper tag on load callback is used to load GPT
            (function() {
                var gads = document.createElement('script');
                var useSSL = 'https:' == document.location.protocol;
                gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
                var node = document.getElementsByTagName('script')[0];
                node.parentNode.insertBefore(gads, node);
            })();
        }
    </script>
    <!--GPT Tag ends here -->
    <!--Wrapper Tag starts here -->
    <script type="text/javascript">
        (function() {
            var wtads = document.createElement('script');
            wtads.async = true;
            wtads.type = 'text/javascript';
            wtads.src = 'owt.js';
            var node = document.getElementsByTagName('script')[0];
            node.parentNode.insertBefore(wtads, node);
        })();
    </script>
    <!--Wrapper Tag ends here -->


## Test

You can either test the generated open wrapper tag in your local dev/test environment or if you just want to see how it works, you can refer to the below links to demo pages section that are checked in.


# Global Parameters And Configuration

These are the parameters which will be part of the standard wrapper configuration and should be defined outside the partner level configurations.

**Analytics endpoint should be CORS compliant, as we will send data in POST : OPenWrap Github**

| Config | Value| Mandatory| Explanation| Input Source|
| --- | --- | --- | --- | --- |
| Key Name | <span style="color: rgb(84,84,84);">pub_id</span> | Y | <span>This ID is used as a global identifier for logging analytics data. Value for this parameter should be the ID of the publisher account on the platform used for logging. </span> | <span>Publisher Provided</span> |
| Key Name | t | Y | Timeout for all partners for responding with a bid. This value should be in milliseconds. | Publisher Provided |
| Key Name | winURL | N | <span>This URL will be executed when any of the partner in wrapper displays creative.This would be a tracker endpoint. This URL should be without a protocol prefix.e.g. a.analytics.com/tracker<br>Query parameters to be passed over this URL:<br>1.  pubid: Identifier of publisher account in logging platform.<br>2.  purl: Page URL<br>3.  tst: Timestamp<br>4.  iid: Impression ID<br>5.  pid: Profile ID<br>6.  pdvid: Profile Version ID<br>7.  slot: Slot Name<br>8.  pn: Partner Name<br>9.  en: ECPM Net<br>10.  eg: ECPM Gross<br>11.  kgpv: Slot name generated using KGP Patterns.</span>|
| Key Name | dataURL | N | <span>This URL will capture all the bid and latency data from all partners in wrapper tag.<br>This URL should be without a protocol prefix e.g a.analytics.com/logger.<br>It takes only one query parameter named 'json' whose value should be URL encoded JSON string.<br>Below are the details of every key in the JSON data.<br>1.  s: Slot array<br>2.  sn: Slot name<br>3.  sz: size array<br>4.  ps: partner bid response array<br>5.  pn: Partner name<br>6.  kgpv: Key generation pattern's value<br>7.  psz: Partner size<br>8.  eg: Gross ECPM<br>9.  en: Net ECPM<br>10.  l1: Partner latency<br>11.  l2: Not used<br>12.  t: Timeout flag (whether partner has timed out or not)<br>13.  wb: Winning bid flag. 1 if partner bid is won.<br>14.  pubId: Identifier of publisher Id on logging/tracking platform.<br>15.  to: Timeout value<br>16.  purl: Page URL<br>17.  tst: Timestamp<br>18.  iid: Impression ID<br>19.  pid: Profile ID<br>20.  pdvid: Profile Version ID <br>21.  json_data</span> |

### Wrapper Keys Sent to DFP

|Key Name| Explanation | Sample Value 
------ | ------|-----------
|pwtecp | The eCPM of bid in USD up to 4 decimal places | 1.4356 |
|pwtbst | Bid Status Flag, will be 1 in case of positive bid | 1 |
|pwtdid | Deal Id, in case the bid has a deal associated | XYZ-DEAL 123 |
|pwtsid | The slot/bid id of the highest or winning bid | e7424477d70315b8a4bae5cff1887edf |
|pwtpid | All partner data organized by partner name.<br>A filter can be added to retrieve data for a specific partner.<br><br>Examples:<br> pwtpid - to retrieve all partner data by partner name<br>pwtpid=pubmatic - to retrieve data only for PubMatic<br><br>For partner names, refer ***bidder code*** used in [PreBid bidders documnetation](http://prebid.org/dev-docs/bidders.html)| pubmatic |
|pwtdeal_&lt;BidderCode&gt;|Paertner specific dealID and dealChannel based targeting can be done using this key.<br>Format of the value is: `<DealChannel>_-_<DealId>_-_<BidId>` |Key: pwtdeal_pubmatic<br>Value: `PMPG_-_dealxyz_-_123456` |


# Partner Adapters and Auction Logic

## Partner Parameters

Here are the details on what partners are supported by Wrapper Tag Solution and various optional/mandatory partner parameters required to make a bid request:

### Common Parameters

|Config | Value | Mandatory | Explanation | Input Source
------ | ------|-----------|-------------|-------------
| Key Name | <span style="color: rgb(84,84,84);">rev_share</span> | Y | <span>Bid Adjustment. This can be used to adjust net to gross, and currency. Example: If partner is charging 15% revenue share then the value for this parameter should be 15\.If incoming bid from partner is $1, actual value considered in auction would be $0.85\.</span> | Publisher Provided |
| Key Name | throttle | Y | Value of this parameter would be the percentage of impressions allocated to a partner\.Recommended value is 100 i.e. send all bid requests to a partner\.| <span> </span>Publisher Provided |
| Key Name | kgp | Y |<span> Key Generation Pattern macro. The combination of these macros would be used to decide the key for picking up partner parameters from KLM json. Supported patterns are- <br>\_DIV_ (div ID from page)<br>\_W_ (width)<br>\_H_ (height)_AU_ (DFP/GPT ad unit)<br>\_AUI_ (DFP/GPT ad unit index) Used in case if there are multiple slots with same ad unit.<br>_I_ (index) Used in case if we have multiple ad units with same size<br>Example: <br>For **size level** mapping, the macro may look like _W_x_H_@_W_x_H_:_I_ <br>e.g. 720x90@720x90:1<br>For **div size** mapping, the macro may look like _DIV_@_W_x_H_<br>e.g. div ID can be div-atf-leaderboard, and size supported by this div can be 720x90, then a key to find parameters from KLM json would bediv-atf-leaderboard@720x90 </span>| Publisher Provided |

For partner specific keys, refer to [PreBid bidders documnetation](http://prebid.org/dev-docs/bidders.html)


## Auction and Timeout

  ![Auction Logic](https://raw.githubusercontent.com/PubMatic/OpenWrap/master/images/AuctionLogic.png)

  ***Note***: As of current release, we are not capturing post-timeout bids as depicted in above diagram. We will support the same in subsequent release.

# DFP Setup and Line Item creation

# Ad Server Configuration

## Trafficking Wrapper Line Items

This step is required so the ad server, based on actual bid price, can allocate impressions to the winning partner. These bids are passed using key-value pairs added to the ad server tags dynamically, as explained in the previous sections.


**Step 1:** Create a new order in DFP for a Wrapper as OpenWrap as the advertiser and add the relevant details.


![New Order](https://raw.githubusercontent.com/PubMatic/OpenWrap/master/images/New%20Order.jpg)
  
  
**Step 2:** Set the price and priority of the line items.  

![Step 2](https://raw.githubusercontent.com/PubMatic/OpenWrap/master/images/LineItem.jpg)
  

**Step 3:** Set targeting on the “pwtbst” value as 1 from the. In addition to  “pwtbst”,  you will also need to set targeting on “pwtecp”.  For more information, please refer to the [Best Practices to Create Line Items]

![Step 3](https://raw.githubusercontent.com/PubMatic/OpenWrap/master/images/Targeting.jpg)


**Step 4:** Add the Wrapper creative provided by PubMatic to the line item you created. 

    <script type='text/javascript'>
    var i = 0, w = window.self;
    while(w!== window.top && !(w.PWT && w.PWT.displayCreative) && i<10){
     w = window.self.parent; i++;
    }
    try{ w.PWT.displayCreative(document, '%%PATTERN:pwtsid%%'); } catch(e){}
    </script></script></pre>


## Best Practices for Creating Granular Line Items

**Note: If DFP is the ad server,</span>** **<span>ensure the line items do NOT have the Google safe frame setting enabled.</span>** >
After June 27th, 2016, line items are automatically created in DFP with safe frame enabled by default. This setting will cause the creative to appear as blank. This requires that users manually uncheck "safe frame," regardless of whether it was manually or automatically enabled.

To control monetization through OpenWrap at a granular level, you may:

*   Create multiple line items in the ad server for each ad unit/ad size/CPM range/geo.
*   Use “**pwtecp**” as the targeting attribute.
*   Place the line items at different priorities based on the desired configuration.

While creating line items at multiple price points, we recommend you create line items with more granular pricing where the bid density is high.

**For example:**

If 80% of the bids are between $0 to $3, create line items at a $0.1 granularity. For other ranges you can create line items at a coarse granularity.

Please see more details below. 

**30 line items between $0-$3 with rate increment of $0.1**

LineItem 1 (covers $0-$0.09)  Targeting: pwtecp=0.01*,pwtecp=0.02*....,pwtecp=0.09*, rate=$0.05

LineItem 2 (covers $0.10-$0.19) Targeting: pwtecp=0.1*, rate=$0.15

and so on for next 28 line items


**15 Line items between $3-$8 with rate increment of $0.30**

LineItem 31 (covers $3.0-$3.29)  Targeting: pwtecp=3.0*,pwtecp=3.1*,pwtecp=3.2*, rate=$3.15

LineItem 32 (covers $3.30-$3.59)  Targeting: pwtecp=3.3*,pwtecp=3.4*,pwtecp=3.5*, rate=$3.45

and so on for next 13 line items   


**12 Line items between $9-$20 with rate increment of $1.0**

LineItem 46 (covers $9.0-$9.99)  Targeting: pwtecp=9.*, rate=$9.5

LineItem 47 (covers $10.0-$10.99)  Targeting: pwtecp=10.*, rate=$3.45

and so on for next 10 line items   


**A final high- priority line item for very high bids**

Line Item 58 (Covers $20 and above) Targeting : pwtecp=20*,pwtecp=21*,pwtecp=22*...... pwtecp=50*) rate= $21

<span style="color: rgb(0,0,0);font-size: 20.0px;line-height: 1.5;">
</span>

## <span style="color: rgb(0,0,0);font-size: 20.0px;line-height: 1.5;">Targeting PMP deals</span>

</a></div>

<a></a></div>

<a></a></div>

<a>

<span class="s1">If you are looking forward to prioritizing this deal in your stack, or you want deals to show up separately in your DFP ad server, here are next steps to follow.</span>

<span class="s1">You will have to create a line item, and then you will have to target it like this. **pwtbst**=1</span> <span class="s2">AND</span> <span class="s3">**pwtdid**=Deal ID from Partner.</span>

<span class="s1">E.g This is how your line item should look like if you are targeting PubMatic deals</span>

![PMP Deals](https://raw.githubusercontent.com/PubMatic/OpenWrap/master/images/PMP.png)

The creative size can be as desired and the creative code will be same as other OpenWrap generic creative. 

### <span class="s1">Popular use cases for Trafficking PMP as different line items in DFP</span>

<span class="s1">Case 1: If you want to prioritize the bids from deal to be delivered above standard  and don’t want PMP bid beaten certain standard line items you will then need to traffic it with priority above the standard line items.</span>

<span class="s1">Case 2: In case you want PMP to deliver unless open market/ other demand pays more than $X then enter the rate of this PMP Price Priority line item as $X.</span>

<span class="s1">Case 3: If you just want to see its report separately from regular line items, the you will have to keep the true eCPM of that PMP deal, and additionally you will need to target  </span> <span class="s4">**pwtbst**=1</span> <span class="s5">AND</span> <span class="s1">**pwtdid**=Deal_ID </span>

<span class="s1">Note for reporting on specific key-value, both the key and value need to be predefined in DFP.</span>

<span class="s1">Also if you are targeting multiple deals to that line item, you will then need to do one more modification. You will need to add a second deal as</span> <span class="s4">**pwtbst**=1</span> <span class="s5">AND</span> <span class="s1">**pwtdid**=DealID1</span> <span class="s6">OR</span> <span class="s1">DealID2 and your order would look like this:</span>

![PMP Use Cases](https://raw.githubusercontent.com/PubMatic/OpenWrap/master/images/PMP1.png)

<span class="s1">If there is some convention in naming PMP deals, then instead of including all exact deal names, you can use pwtdid starts with PM-DEAL* , will reduce setup efforts while adding new PMP deals.</span>

<span class="s1">
</span>

<span class="s1">
</span>

<span class="s1">
</span>

# Demo Setup and Examples

The following are the demo pages for OpenWrap You can use these pages to test your setup and to check how OpenWrap works.

1.  [Wrapper Tag Sync Demo Page](https://raw.githubusercontent.com/PubMatic/OpenWrap/master/sample_pages/WTSyncDemo.html)
2.  [Wrapper Tag Async Demo Page](https://raw.githubusercontent.com/PubMatic/OpenWrap/master/sample_pages/WTAsyncDemo.html)
3.  [Wrapper Tag Sync Demo Page with GPT SRA functionality](https://raw.githubusercontent.com/PubMatic/OpenWrap/master/sample_pages/WTSyncDemo_SRA.html)
4.  [Wrapper Tag Sync Demo Page with GPT DisableInitialLoad functionality](https://raw.githubusercontent.com/PubMatic/OpenWrap/master/sample_pages/WTSyncDemo_DisableInitialLoad.html)
5.  [Wrapper Tag Sync Demo Page with GPT Refresh functionality](https://raw.githubusercontent.com/PubMatic/OpenWrap/master/sample_pages/WTSyncDemo_Refresh.html)

Sample Open Wrapper Java Script: [Open Wrapper JS Script](https://raw.githubusercontent.com/PubMatic/OpenWrap/master/sample_pages/owt.js) (owt.js). This script needs to be hosted at the same location as the demo page. 

The demo pages have all the adapter-related custom configurations in the page itself, which can be changed/edited according to the requirement. 

To change the configuration and check bid responses use following JSFiddles :

[https://jsfiddle.net/OpenWrap/rd1u9s4e/](https://jsfiddle.net/OpenWrap/rd1u9s4e/)

[https://jsfiddle.net/OpenWrap/g9u42n02/](https://jsfiddle.net/OpenWrap/g9u42n02/)

# Limitations

## Safe Frame
Expandable creative will not work correctly after rendering inside safe frame on Safari, IE11/Edge
 
</a>
