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
					"Div_1": {
						spaceId: 14071
					},
					"Div-2": {
						spaceId: 14071
					}
				}
			}
		}
	}
};

// TODO

// step 2: all methods over config should stay here only
//			remove them from other code parts

exports.getTimeout = function(){
	return parseInt(this.config.global.t) || 1000;
};

