adapterManagerRegisterAdapter((function(){
	var adapterID = 'PB_appnexus';
	return {		
		fB: function(){},	
		dC: utilDisplayCreative,
		ID: function(){
			return adapterID;
		}
	};
})());