exports.pwt = {
	t: "3000",
	pid: "46",
	gcv: "11",
	pdvid: "4",
	pubid: "9999",
	dataURL: "t.pubmatic.com/wl?",
	winURL: "t.pubmatic.com/wt?"
};

exports.adapters = {
	/*pubmatic: {
		pub_id: "9999",
		rev_share: "0.0",
		timeout: "2000",
		throttle: "100",
		kgp: "_AU_@_W_x_H_:_AUI_",
		sk: "true"
	}
	,*/prebid: {
		rev_share: "0.0",
		timeout: "2000",
		throttle: "100",
		kgp: "_DIV_",
		klm: {								
		}
	},
	PB_pubmatic: {
		rev_share: "0.0",
		throttle: "100",
		publisherId: "9999",
		kgp: "_DIV_",
		klm: {
			"Div_1": {				
				adSlot: "DIV1_38519891@300x250"
			},
			"Div-2": {
				adSlot: "DIV2_38519891@300x250"
			}
		}
	},
	PB_sekindoUM: {
		rev_share: "0.0",
		throttle: "100",
		kgp: "_DIV_",
		klm: {
			"Div_1": {
				spaceId: 14071
			},
			"Div-2": {
				spaceId: 14071
			}
		}
	},
	PB_appnexus: {
		rev_share: "0.0",
		throttle: "100",
		kgp: "_DIV_",
		klm: {
			"Div_1": {
				placementId: "8801674"
			},
			"Div-2": {
				placementId: "8801685"
			}
		}
	}
};