adapterManagerRegisterAdapter((function() {

    window.ybotq = window.ybotq || [];

    var adapterID = 'yieldbot',
        constConfigPSN = 'psn',
        constConfigSlot = 'slot',
        adapterConfigMandatoryParams = [constConfigPSN, constConfigKeyGeneratigPattern, constConfigKeyLookupMap],
        slotConfigMandatoryParams = [constConfigSlot],
        psn = '',
        internalMap = {},

        adapterScriptPath = '//cdn.yldbt.com/js/yieldbot.intent.js',

        fetchBids = function(configObject, activeSlots){
            utilLog(adapterID+constCommonMessage01);

            var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID, adapterConfigMandatoryParams);
            if(!adapterConfig){
                return;
            }

            var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
            var keyLookupMap = adapterConfig[constConfigKeyLookupMap];
            psn = adapterConfig[constConfigPSN];
            var definedSlots = [];

            utilForEachGeneratedKey(
                adapterID,
                slotConfigMandatoryParams,
                activeSlots, 
                keyGenerationPattern, 
                keyLookupMap, 
                function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){

                    if(psn && keyConfig[constConfigSlot]){
                        var callbackId = utilGetUniqueIdentifierStr();
                        internalMap[callbackId] = {};
                        internalMap[callbackId][constCommonConfig] = {
                            'params': keyConfig,
                            'divID': currentSlot[constCommonDivID],              
                            'sizes': currentSlot[constAdSlotSizes]
                        };
                        internalMap[callbackId][constCommonKeyGenerationPatternValue] = generatedKey;
                        definedSlots.push(callbackId);
                    }
                }
            );

            if(definedSlots.length){
                ybotq.push(function(){
                    var yieldbot = window.yieldbot;
                    utilEach(definedSlots, function(callbackId) {
                        if(utilHasOwnProperty(internalMap, callbackId)){
                            var bid = internalMap[callbackId][constCommonConfig];
                            yieldbot.pub(psn);
                            yieldbot.defineSlot(bid[constCommonParams].slot, {sizes: bid[constCommonSizes] || []});   
                        }
                    });
                    yieldbot.enableAsync();
                    yieldbot.go();
                });

                ybotq.push(function () {
                    handleUpdateState();
                });

                utilLoadScript(adapterScriptPath);
            }else{
                utilLog(adapterID+': definedSlots are empty.');
            }
        },        

        handleUpdateState = function(){
            var yieldbot = window.yieldbot;

            for(var v in internalMap){

                var adapterConfig
                ;
                if(utilHasOwnProperty(internalMap, v) && internalMap[v].exp != true){
                    internalMap[v].exp = true;
                    adapterConfig = internalMap[v][constCommonConfig] || {};
                    var criteria = yieldbot.getSlotCriteria(adapterConfig[constCommonParams].slot || '');
                    var bid = buildBid(criteria, internalMap[v][constCommonKeyGenerationPatternValue]);                    
                    bidManagerSetBidFromBidder(adapterConfig[constCommonDivID], adapterID, bid);                    
                }
            }
        },

        buildBid = function(slotCriteria, kgpv){
            var bidObject = {};

            if (slotCriteria && slotCriteria.ybot_ad && slotCriteria.ybot_ad !== 'n') {

                var szArr = slotCriteria.ybot_size ? slotCriteria.ybot_size.split('x') : [0,0],
                    slot = slotCriteria.ybot_slot || '',
                    sizeStr = slotCriteria.ybot_size || ''; // Creative template needs the dimensions string     

                bidObject = bidManagerCreateBidObject(
                    parseInt(slotCriteria.ybot_cpm) / 100.0 || 0,
                    bidManagerCreateDealObject(),
                    "",
                    buildCreative(slot, sizeStr),
                    "",
                    szArr[0] || 0,
                    szArr[1] || 0,
                    kgpv
                );

            } else {

                bidObject = bidManagerCreateBidObject(
                    0,
                    bidManagerCreateDealObject(),
                    "",
                    "",
                    "",
                    0,
                    0,
                    kgpv
                );
            }

            return bidObject;
        },

        buildCreative = function(slot, size){
            return '<script type="text/javascript" src="'+adapterScriptPath+'"></script>' +
                '<script type="text/javascript">var ybotq = ybotq || [];' +
                'ybotq.push(function () {yieldbot.renderAd(\'' + slot.toLowerCase() + ':' + size + '\');});</script>';
        }
    ;

    return {
        fB: fetchBids,
        dC: utilDisplayCreative,
        ID: function(){
            return adapterID;
        }
    };
})());