pwtCreatePrebidNamespace = function(preBidNameSpace) {
	window[preBidNameSpace] = window[preBidNameSpace] || {}; window[preBidNameSpace].que = window[preBidNameSpace].que || [];
};