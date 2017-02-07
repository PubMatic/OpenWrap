import os

#Developers can add or remove adapters from adapterFiles array below to include only required adapters in generated wrapper tag.
#For example, if rubicon is not the SSP you work with, you can remove 'adapters/rubicon.js' from below array. 
#The same way if you want to add any partner adapter to below array, just append it to this array. Adapters for supported partners are present in src/adapters directory.
#Please refer to documentation if adapter you are looking to add is not present in src/adapters directory.
adapterFiles = ['adapters/pubmatic.js', 'adapters/appnexus.js', 'adapters/bRealTime.js', 'adapters/districtM.js', 'adapters/openx.js', 'adapters/rubicon.js', 'adapters/rubiconFastlane.js', 'adapters/indexExchange.js', 'adapters/yieldbot.js', 'adapters/adForm.js', 'adapters/pulsePoint.js', 'adapters/sovrn.js', 'adapters/aol.js']

#These are mandatory files for open wrapper code generation. Please do not remove any file from this array.
fileNames = ['commonVariables.js', 'util.js', 'adapterManager.js', 'bidManager.js']
fileNames.extend(adapterFiles)

#Developer can provide custom controller. Below one is for Google publisher tag.
controllerFile = 'controllers/gpt.js'
fileNames.extend([controllerFile, 'owt.js'])

#outPutFileName is the generated openwrapper javascript
outPutFileName = 'dist/owt.combine.js'
#outPutMinFileName is the minified version of openwrapper javascript
outPutMinFileName = 'dist/owt.combine.min.js'

#Generate a wrapper code using all the files from array fileNames
with open(outPutFileName, 'w') as outfile:	
	outfile.write('(function(){')
	for fname in fileNames:
		with open('src/'+fname) as infile:
			outfile.write('\n')
			for line in infile:
				outfile.write(line)
			outfile.write('\n')
	outfile.write('\n')		
	outfile.write('})();')
#Minify the generated wrapper code 
os.system("java -jar yuicompressor-2.4.2.jar " + outPutFileName    + "  -o " + outPutMinFileName);