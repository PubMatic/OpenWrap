exports.pwt = {};
exports.testConfigDetails = undefined;
exports.test_pwt = undefined;
exports.adapters = undefined;
exports.identityPartners = undefined;
exports.slotConfig = undefined;
exports.alias = undefined;
exports.test_adapters = undefined,
exports.test_identityPartners = undefined;

var refThis = this;

exports.setOWConfig = function(owConfig) {
  if (!owConfig || typeof owConfig !== 'object') {
    console.log('OpenWrap config not defined...');
    return;
  }
  refThis.pwt = owConfig.pwt;
  refThis.testConfigDetails = owConfig.testConfigDetails;
  refThis.test_pwt = owConfig.test_pwt;
  refThis.adapters = owConfig.adapters;
  refThis.identityPartners = owConfig.identityPartners;
  refThis.slotConfig = owConfig.slotConfig;
  refThis.alias = owConfig.alias;
  refThis.test_adapters = owConfig.test_adapters;
  refThis.test_identityPartners = owConfig.test_identityPartners;
};
