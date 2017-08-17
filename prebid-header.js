function pwtCreatePrebidNamespace(namespace) {
	window[namespace] = namespace || {}; window[namespace].que = window[namespace].que || [];
