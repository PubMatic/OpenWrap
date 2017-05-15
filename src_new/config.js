exports.config = {
	global: {
		pwt: {
			t: "3000",
			pid: "46",
			gcv: "11",
			pdvid: "4",
			pubid: "9999",
			dataURL: "t.pubmatic.com/wl?",
			winURL: "t.pubmatic.com/wt?"
		},
		adapters: {
			pubmatic: {
				pub_id: "9999",
				rev_share: "0.0",
				timeout: "2000",
				throttle: "100",
				kgp: "_AU_@_W_x_H_:_AUI_",
				sk: "true"
			}
			,prebid: {
				rev_share: "0.0",
				timeout: "2000",
				throttle: "100",
				kgp: "_DIV_",
				klm: {								
				}
			},
			PB_sekindoUM: {
				rev_share: "0.0",
				timeout: "2000",
				throttle: "100",
				kgp: "_DIV_",
				klm: {
					"div-gpt-ad-12345678-1": {
						spaceId: 14071
					},
					"div-gpt-ad-12345678-2": {
						spaceId: 14071
					}
				}
			}
		}
	}
};

// step 1: copy paste config here as it is now and pass to owt.js

// step 2: all methods over config should stay here only
//			remove them from other code parts