/* globals console,document,window,cordova */
document.addEventListener('deviceready', onDeviceReady, false);

var logOb;

function fail(e) {
	console.log("FileSystem Error");
	console.dir(e);
}

function onDeviceReady() {

	window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, function(dir) {
		console.log("directory: " + cordova.file.applicationStorageDirectory);
		console.log("got main dir " + dir.toString(),dir);
		dir.getFile("log.txt", {create:true}, function(file) {
			console.log("got the file " + file.valueOf(), file);
			logOb = file;
			writeLog("App started");			
		});
	});
	
	document.querySelector("#actionOne").addEventListener("touchend", function(e) {
		//Ok, normal stuff for actionOne here
		//
		//Now log it
		writeLog("actionOne fired");
	}, false);

	document.querySelector("#actionTwo").addEventListener("touchend", function(e) {
		//Ok, normal stuff for actionTwo here
		//
		//Now log it
		writeLog("actionTwo fired");
	}, false);
	document.querySelector("#printFile").addEventListener("touchend", function(e) {
		writeLog("printFile event");
		printFile();
	}, false);



}

function printFile() {
	if(!logOb) {
		console.log("logfile was not found, will not write");
		return;
	}
	logOb.file(function(file) {
		var reader = new FileReader();

		reader.onloadend = function(e) {
			console.log(this.result);
		};

		reader.readAsText(file);
	}, fail);
}

function writeLog(str) {
	if(!logOb) {
		console.log("logfile was not found, will not log");
		return;
	}
	var log = str + " [" + (new Date()) + "]\n";
	console.log("writing to log: "+log +"'");
	logOb.createWriter(function(fileWriter) {
		
		fileWriter.seek(fileWriter.length);
		
		var blob = new Blob([log], {type:'text/plain'});
		fileWriter.write(blob);
		console.log("ok, in theory i worked");
	}, fail);
}

function justForTesting() {
	logOb.file(function(file) {
		var reader = new FileReader();

		reader.onloadend = function(e) {
			console.log(this.result);
		};

		reader.readAsText(file);
	}, fail);

}