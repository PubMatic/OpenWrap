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
	prebid: {
		rev_share: "0.0",
		throttle: "100",
		kgp: "_DIV_",
		klm: {								
		}
	},
	pubmatic: {
		rev_share: "0.0",
		throttle: "100",
		publisherId: "9999",
		kgp: "_DIV_@_W_x_H_:_AUI_"
	},
	sekindoUM: {
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
	appnexus: {
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