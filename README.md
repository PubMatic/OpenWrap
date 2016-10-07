
# Introduction

The problem of running multiple header tags from different providers is something which publisher has always struggled with.

There are issues like

*   Code conflict, 
*   Inability to control timeouts efficiently
*   Development time required per integration
*   Scattered analytics
*   Changing the page and tag structure to accommodate for header tag.

To solve for all the issues we came up with a simple to use wrapper tag which solves for all the issues above and most important, it is specially developed to be a throw on page and play model for GPT tags. What this means for publishers:

*   No changes to GPT structure 
*   No coding required to get and push bids to GPT (not even setting targeting)
*   Works with standard as well as advanced GPT implementations.

In short what publisher has to do is push the wrapper script and partner configuration on page and you are all done REALLY!! . The script takes care of detecting what ad-units, divs and sizes are on page, fire up calls to desired partners and attach bids to DFP calls as key-values.

# Design and Execution Flow

# <span style="font-size: 20.0px;line-height: 1.5;">Interaction with GPT tag</span>

*   Wrapper script interacts with GPT tags by overriding basic GPT functions like display(), refresh() ... 
*   The original display calls to DFP are put in queue till all the Wrapper partners are called for bid or desired timeout is reached.
*   Final auction between the bids takes place and highest bid is pushed as key-value to DFP

*   Here is the flow diagram for someone who wants to have a look at the code and understand what is happening inside the hood.
  ![alt text](https://inside.pubmatic.com:8443/confluence/download/attachments/60790030/OpenWrap-GPT%20%281%29.png "OpenWrap-GPT")


# Getting Started

## Check Out

PubMatic Open wrapper is available to check out from git repository <LINK>. The source files include adapters for all our integrated partners listed in below section. Developer has to include only the required partners while building and generating a tag using options explained in build section.

## Build

The checked out source contains adapters for below partners.

1.  AdForm
2.  AppNexus
3.  bRealTime
4.  DistrictM
5.  IndexExchange
6.  OpenX
7.  PubMatic
8.  Rubicon
9.  Yieldbot

We have a python build script which would help you build the wrapper tag with only partner adapters that you need and give you a minified tag which you can directly use.

From the repository you have checked out, run combine.py. Once this file is executed, you will get owt.combine.js and owt.combine.min.js generated in directory named 'dist'.
Combine.py contains adapterFiles array which holds all the partner adapters to be included in generated open wrapper js file. You may want to add or remove partner adapters to keep only required partners included in your tag.

## Deploy

The generate script should be deployed on a test page before trying it on production.
You can load the generated minified js either synchronously or asynchronously in your pages.
To load minified js synchronously, you can use below tag in header section of your test page-

    <script type="text/javascript" src="/js/owt.combine.min.js"></script>


And to load minified js asynchronously, you can use below tag-

    <script type="text/javascript" src="/js/owt.combine.min.js" async></script>


## Test

You can either test the generated open wrapper tag in your local dev/test environment or if you just want to see how it works, you ocan refer below links to demo pages that we have hosted.

<Links to demo environment>

# Partner Adapters and Auction Logic

## Partner Parameters

Here are the details on what partners are supported by Wrapper Tag Solution and various optional/mandatory partner parameters required to make a bid request:

### PubMatic


Config | Value | Mandatory | Explanation | Input Source
------ | ------|-----------|-------------|-------------

| Key Name | <span style="color: rgb(84,84,84);">pub_id</span> | Y | <span>PubMatic publisher ID</span> | Publisher Provided |
| Key Name | <span style="color: rgb(84,84,84);">sk</span> | Y | PubMatic server key flag indicating that slot mapping is at Ad Server side.
Slot name would be generated based on KGP macro and sent as is to PubMatic. | <span>Hardcoded as true</span> |

Response Mapping:

| OpenWra Wrapper | Partner response key | Conversion | Explanation |
| --- | --- | --- | --- |
| pwtecp | ads[0].cpm | No | Bid value (USD) |



### Rubicon Legacy


Config | Value | Mandatory | Explanation | Input Source
------ | ------|-----------|-------------|-------------
Partner JS Library | [https://ads.rubiconproject.com/ad/](https://ads.rubiconproject.com/ad/)</span> [<span style="color: rgb(48,57,66);"><account_id>.js</span>](https://ads.rubiconproject.com/ad/) | Y | account_id is Rubicon publisher ID | Generated from account_id Provided by Publisher |
| Key Name | <span style="color: rgb(84,84,84);">account_id</span> | Y | <span>Rubicon publisher ID</span> | Publisher Provided |
| Key Name | <span style="color: rgb(84,84,84);">site_id</span> | Y | Rubicon Identifier for Site | <span>Publisher Provided</span> |
| <span>Key Name</span> | <span style="color: rgb(84,84,84);">zone_id</span> | Y | <span>Rubicon Identifier for Zone</span> | <span>Publisher Provided</span> |
| <span>Key Name</span> | <span style="color: rgb(84,84,84);">size_id</span> | Y | <span>Rubicon Identifier for Size</span> | <span>Publisher Provided</span> |
| Key Name | tracking | N | Optional tracking code | Publisher Provided |

Response Mapping:

| Wrapper Key | Partner response key | Conversion | Explanation |
| --- | --- | --- | --- |
| pwtecp | ads[0].cpm | No | Bid value (USD) |

### OpenX

| Config | Value | Mandatory | Explanation | 
| --- | --- | --- | --- | --- |
| Partner JS Library | <span style="color: rgb(48,57,66);">[http://publisher-xxx.openx.net/w/1.0/jstag?nc=xxxxxxx-publisher](http://publisher-xxx.openx.net/w/1.0/jstag?nc=xxxxxxx-publisher)</span> | Y | JS library URL | Publisher Provided |
| Key Name | <span style="color: rgb(84,84,84);">unit</span> | Y | OpenX adunit Identifier | Publisher Provided |

Response Mapping:

| Wrapper Key | Partner response key | Conversion | Explanation |
| --- | --- | --- | --- |
| pwtecp | pub_rev | Cent to Dollar | Bid value (USD) |

### Appnexus

|Config | Value | Mandatory | Explanation | Input Source |
| --- | --- | --- | --- | --- |
| Partner JS Library | The code is from PreBid | N/A | JS library URL is not required as the code for calling Appnexus Endpoint ( <span style="color: rgb(0,0,0);">[http://ib.adnxs.com/jpt](http://ib.adnxs.com/jpt))</span> | Prebid Code |
| Key Name | placementId | Y | Appnexus adunit Identifier | Publisher Provided |
| <span>Key Name</span> | member | N | Member ID for Appnexus, to be used in conjunction with invCode | <span>Publisher Provided</span> |
| <span>Key Name</span> | invCode | N | Inventory code from Appnexus <span>to be used in conjunction with member</span> | <span>Publisher Provided</span> |
| <span>Key Name</span> | query | N | Optional query parameter. **Note:** This is not supported right now <span>as it will be deprecated soon by Appnexus(as mentioned in PreBid code).</span> | Publisher Provided |

Response Mapping:

| Wrapper Key | Partner response key | Conversion | Explanation |
| --- | --- | --- | --- |
| pwtecp | result.cpm | result.cpm/10000 | Bid value (USD) |
| pwtdid | result.deal_id | N/A | Deal ID |

### YieldBot

| Config | Value | Mandatory | Explanation | Input Source |
| --- | --- | --- | --- | --- |
| Partner JS Library |   <span style="color: rgb(48,57,66);">[http://cdn.yldbt.com/js/yieldbot.intent.js](http://cdn.yldbt.com/js/yieldbot.intent.js)</span> | Y | JS library URL | This is fixed for YB |
| Key Name | psn | Y | Yieldbot publisher ID | Publisher Provided |
| Key Name | slot | Y | The slot configure Yieldbot | Publisher Provided |

Response Mapping:

| Wrapper Key | Partner response key | Conversion | Explanation | 
| --- | --- | --- | --- |
| pwtecp | ybot_cpm | cent to Dollar | Bid value (USD) |

### IndexExchange

|Config | Value | Mandatory | Explanation | Input Source |
| --- | --- | --- | --- | --- |
| End-point |   <span style="color: rgb(48,57,66);">[://as-sec.casalemedia.com/headertag?v=9&x3=1&fn=cygnus_index_parse_res](https://inside.pubmatic.com//as-sec.casalemedia.com/headertag?v=9&x3=1&fn=cygnus_index_parse_res)</span> | NA | OpenRTB end-point | This is fixed |
| Key Name | <span>siteID</span> | Y | Site ID STRING | Publisher Provided |
| Key Name | <span>tier2SiteID</span> | N | <span>tier-2 Site ID <span>STRING</span></span> | Publisher Provided |
| Key Name | <span>tier3SiteID</span> | N | <span>tier-3 Site ID <span>STRING</span></span> | <span>Publisher Provided</span> |

Response Mapping:

| Wrapper Key | Partner response key | Conversion | Explanation |
| --- | --- | --- | --- |
| pwtecp | seatbid.bid[N].ext.pricelevel | cent to Dollar | Bid value (USD) **Note:** <span>the response can be in different currency which needs to be adjusted in Bid Adjustment</span> |

### AdForm

| Config | Value | Mandatory | Explanation | Input Source |
| --- | --- | --- | --- | --- |
| End-point | Default value is <span style="color: rgb(199,37,78);">[adx.adform.net](http://adx.adform.net)</span> <span style="color: rgb(48,57,66);"> </span> | N | AdForm end-point domain | Publisher Provided |
| Key Name | <span>mid</span> | Y | Master Tag Id for Adform | Publisher Provided |
| Key Name | <span>inv</span> | N | Inventory Code | Publisher Provided |
| Key Name | minip | N | Hard Floor (Will be passed as is no currency conversion) | <span>Publisher Provided</span> |

Response Mapping:

| Wrapper Key | Partner response key | Conversion | Explanation |
| --- | --- | --- | --- |
| pwtecp | winbid | N/A | Bid value (USD), **Note:** the response can be in different currency which needs to be adjusted in Bid Adjustment |

### **DistrictM**

| Config | Value | Mandatory | Explanation | Input Source |
| --- | --- | --- | --- | --- |
| Partner JS Library | The code is from PreBid | N/A | <span>JS library URL is not required as the code for calling <span>DistrictM</span> Endpoint (</span> <span style="color: rgb(0,0,0);">[http://ib.adnxs.com/jpt](http://ib.adnxs.com/jpt))</span> | Prebid Code |
| Key Name | placementId | Y | DistrictM adunit Identifier | Publisher Provided |
| Key Name | member | N | Member ID for <span>DistrictM</span>, to be used in conjunction with invCode | Publisher Provided |
| Key Name | invCode | N | Inventory code from <span>DistrictM</span> to be used in conjunction with member | Publisher Provided |
| Key Name | query | N | Optional query parameter. **Note:** This is not supported right now as it will be deprecated soon by <span>DistrictM </span>(as mentioned in PreBid code). | Publisher Provided |

Response Mapping:

| Wrapper Key | Partner Response Key | Conversion | Explanation |
| --- | --- | --- | --- | --- |
| pwtecp | result.cpm | result.cpm/10000 | Bid value (USD) |
| pwtdid | result.deal_id | N/A | Deal ID |

### **Brealtime**

| Config | Value | Mandatory | Explanation | Input Source |
| --- | --- | --- | --- | --- |
| Partner JS Library | The code is from PreBid | N/A | <span>JS library URL is not required as the code for calling <span>Brealtime</span> Endpoint (</span> <span style="color: rgb(0,0,0);">[http://ib.adnxs.com/jpt](http://ib.adnxs.com/jpt))</span> | Prebid Code |
| Key Name | placementId | Y | <span>Brealtime</span> adunit Identifier | Publisher Provided |
| Key Name | member | N | Member ID for <span>Brealtime</span>, to be used in conjunction with invCode | Publisher Provided |
| Key Name | invCode | N | Inventory code from <span>Brealtime</span> to be used in conjunction with member | Publisher Provided |
| Key Name | query | N | Optional query parameter. **Note:** This is not supported right now as it will be deprecated soon by <span>Brealtime</span>(as mentioned in PreBid code). | Publisher Provided |

Response Mapping:

| Wrapper Key | Partner Response Key | Conversion | Explanation |
| --- | --- | --- | --- | --- |
| pwtecp | result.cpm | result.cpm/10000 | Bid value (USD) |
| pwtdid | result.deal_id | N/A | Deal ID |

## Auction and Timeout

  ![Auction Logic](https://inside.pubmatic.com:8443/confluence/download/attachments/60790030/Auction%20Logic%202%284%29.png)

**NOTE**: In case you want to edit this diagram, import <ac:link><ri:attachment ri:filename="Auction Logic 2(7)"><ac:plain-text-link-body></ac:plain-text-link-body></ri:attachment></ac:link>XML on site [draw.io](https://www.draw.io/)

# DFP Setup and Line Item creation

# Ad Server Configuration

## Trafficking Wrapper Line Items

This step is required so the ad server, based on actual bid price, can allocate impressions to the winning partner. These bids are passed using key-value pairs added to the ad server tags dynamically, as explained in the previous sections.

**Note: The preferred option is for the PubMatic solution engineering team to support the order creation in DFP. You must provide trafficker-level access. PubMatic's order insertion tool can be used to insert the relevant order into DFP and create granular line items.**

**Step 1:** Create a new order in DFP for a Wrapper as OpenWrap as the advertiser and add the relevant details.


    TODO: add Advertiser as OpenWrap in image
    
![New Order](https://inside.pubmatic.com:8443/confluence/download/attachments/60790030/New%20Order.jpg?version=1&modificationDate=1475264075068&api=v2)
  
  
**Step 2:** Set the price and priority of the line items.  

![Step 2](https://inside.pubmatic.com:8443/confluence/download/attachments/60790030/Step%202.jpg?version=1&modificationDate=1475264442924&api=v2)
  

**Step 3: **Set targeting on the “pwtbst” value as 1 from the. In addition to  “pwtbst”,  you will also need to set targeting on “pwtecp”.  For more information, please refer to the [Best Practices to Create Line Items]

![Step 3](https://inside.pubmatic.com:8443/confluence/download/attachments/60790030/Step%203.jpg?version=1&modificationDate=1475264503634&api=v2)


**Step 4: **Add the Wrapper creative provided by PubMatic to the line item you created. 

    <script type='text/javascript'>
    var i = 0, w = window.self;
    while(w!== window.top && !(w.PWT && w.PWT.displayCreative) && i<10){
     w = window.self.parent; i++;
    }
    try{ w.PWT.displayCreative(document, '%%PATTERN:pwtsid%%'); } catch(e){}
    </script></script></pre>

 |

## Best Practices for Creating Granular Line Items

**Note: If DFP is the ad server,</span>** <span> </span> **<span>ensure the line items do NOT have Google safe frame setting enabled.</span>** >
After June 27th, 2016, line items are automatically created in DFP with safe frame enabled by default. This setting will cause the creative to appear as blank. This requires that users manually uncheck "safe frame," regardless of whether it was manually or automatically enabled.

To control monetization through Wrapper Solution at a granular level, you may:

*   Create multiple line items in the ad server for each ad unit/ad size/CPM range/geo.
*   Use “**pwtecp**” as the targeting attribute.
*   Place the line items at different priorities based on the desired configuration.

While creating line items at multiple price points, we recommend you create line items with more granular pricing where the bid density is high.

**For example:**

If 80% of the bids are between $0 to $3, create line items at a $0.1 granularity. For other ranges you can create line items at a coarse granularity.

Please see more details below. 

**30 line items between $0-$3 with rate increment of $0.1    **

LineItem 1 (covers $0-$0.09)  Targeting: pwtecp=0.01*,pwtecp=0.02*....,pwtecp=0.09*, rate=$0.05

LineItem 2 (covers $0.10-$0.19) Targeting: pwtecp=0.1*, rate=$0.15

and so on for next 28 line items

**15 Line items between $3-$8 with rate increment of $0.30    **

LineItem 31 (covers $3.0-$3.29)  Targeting: pwtecp=3.0*,pwtecp=3.1*,pwtecp=3.2*, rate=$3.15

LineItem 32 (covers $3.30-$3.59)  Targeting: pwtecp=3.3*,pwtecp=3.4*,pwtecp=3.5*, rate=$3.45

and so on for next 13 line items   

**12 Line items between $9-$20 with rate increment of $1.0    **

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

<span class="s1">If you are looking forward to prioritize this deal in your stack, or you want deals to report it separately in your DFP ad server. here are the next steps.</span>

<span class="s1">You will have to create a line item, and then you will have to target it like this. **pwtbst**=1</span> <span class="s2">AND</span> <span class="s3">**pwtdid**=Deal ID from Partner.</span>

<span class="s1">E.g This is how your line item should look like if you are targeting PubMatic deals</span>

![PMP Deals](https://inside.pubmatic.com:8443/confluence/download/attachments/60790030/image2016-9-26%2016%3A23%3A56.png?version=1&modificationDate=1474887237067&api=v2)

The creative size can be as desired and the creative code will be same as other OpenWrap generic creative. 

### <span class="s1">Popular use cases for Trafficking PMP as different line items in DFP</span>

<span class="s1">Case 1: if you want to prioritize the bids from deal to be delivered above standard  and don’t want PMP bid beaten certain standard line items you will then need to traffic it with priority above the standard line items.</span>

<span class="s1">Case 2: In case you want PMP to deliver unless open market/ other demand pays more than $X then enter the rate of this PMP Price Priority line item as $X.</span>

<span class="s1">Case 3 :If you just want to see its report separately from regular line items, the you will have to keep the true eCPM of that PMP deal, and additionally you will need to target  </span> <span class="s4">**pwtbst**=1</span> <span class="s5">AND</span> <span class="s1">**pwtdid**=Deal_ID </span>

<span class="s1">Note for reporting on specific key-value, both the key and value needs to be predefined in DFP.</span>

<span class="s1">Also if you are targeting multiple deals to that line item, you will then need to do one more modification. You will need to add second deal as</span> <span class="s4">**pwtbst**=1</span> <span class="s5">AND</span> <span class="s1">**pwtdid**=DealID1</span> <span class="s6">OR</span> <span class="s1">DealID2 and your order would look like this:</span>

![PMP Use Cases](https://inside.pubmatic.com:8443/confluence/download/attachments/60790030/image2016-9-26%2016%3A24%3A37.png?version=1&modificationDate=1474887277744&api=v2)

<span class="s1">If there is some convention in naming PMP deals, then instead of including all exact deal names , you can use pwtdid starts with PM-DEAL* , will reduce setup efforts while adding new PMP deals.</span>

<span class="s1">
</span>

<span class="s1">
</span>

<span class="s1">
</span>

# Demo Setup and Examples

# Development Documents

## Partner Adapter Template

## Testing with partner endpoint

</a>
