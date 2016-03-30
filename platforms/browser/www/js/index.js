/* globals console,document,window,cordova */
document.addEventListener('deviceready', onDeviceReady, false);
var fileName = "acc.log";

var logOb;

//Debug enabled
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
	WebView.setWebContentsDebuggingEnabled(true);
}

function fail(e) {
	console.log("FileSystem Error");
	console.dir(e);
}

function onDeviceReady() {

	window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, function(dir) {
		console.log("directory: " + cordova.file.applicationStorageDirectory);
		console.log("got main dir " + dir.toString(),dir);
		dir.getFile(fileName, {create:true}, function(file) {
			console.log("got the file " + file.valueOf(), file);
			logOb = file;
			writeLog("App started;");
		});
	});
	
	document.querySelector("#actionOne").addEventListener("touchend", function(e) {
		//Ok, normal stuff for actionOne here
		//
		//Now log it
		writeLog("actionOne fired;");
	}, false);

	document.querySelector("#actionTwo").addEventListener("touchend", function(e) {
		//Ok, normal stuff for actionTwo here
		//
		//Now log it
		writeLog("actionTwo fired;");
	}, false);
	document.querySelector("#printFile").addEventListener("touchend", function(e) {
		writeLog("printFile event");
		printFile();
	}, false);

	var options = { frequency: 10000 };  // Update every 3 seconds

	var watchID = navigator.accelerometer.watchAcceleration(logAcceleration, onError, options);



}

function printFile() {
	console.log("print file");
	//postData();
	if(!logOb) {
		console.log("logfile was not found, will not write");
		return;
	}
	/*
	logOb.file(function(file) {
		var reader = new FileReader();

		reader.onloadend = function(e) {
			console.log(this.result);
			var element = document.getElementById('logfile');

			element.innerHTML = this.result;
		};

		reader.readAsText(file);
	}, fail);
	*/
	getData();
	//postData();
	//TODO uploadFile(logOb);
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
		//console.log("ok, in theory i worked");
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

function logAcceleration(acceleration) {
	var accLog = 'Acceleration;' + acceleration.x +';'+acceleration.y+';'+acceleration.z+';'+acceleration.timestamp + '\n'
	writeLog(accLog);

	//document.getelementbyid("accX").innerHTML="hei";
	var element = document.getElementById('accelerometer');
	element.innerHTML=accLog;

	/*
	element.innerHTML = 'Acceleration X: ' + acceleration.x + '<br />' +
		'Acceleration Y: ' + acceleration.y + '<br />' +
		'Acceleration Z: ' + acceleration.z + '<br />' +
		'Timestamp: ' + acceleration.timestamp + '<br />';
		*/
}

function onError() {
	alert('onError!');
}

function uploadFile(logObj) {
	console.log("***upload file***");
	var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName=fileName; //imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType="text/plain";

	var params = {};
	params.value1 = "test";
	params.value2 = "param";

	options.params = params;

	var ft = new FileTransfer();
	ft.upload(fileName, encodeURI("http://192.168.1.220:8080/myapp/myresource"), win, fail, options);
	console.log("***done-upload file***");

}

function getData() {
	console.log("getData");
var request = new XMLHttpRequest();
request.open("GET", "http://192.168.1.220:8080/myapp/myresource/", true);
request.onreadystatechange = function() {//Call a function when the state changes.
	if (request.readyState == 4) {
		if (request.status == 200 || request.status == 0) {
			var data = request.responseText;
			writeLog(data);
			/*
			var tweets = JSON.parse(request.responseText);
			var data = "<table cellspacing='0'>";
			var tableClass;
			for (i = 0; i < tweets.results.length; i++) {
				if (i % 2 == 0) {
					tableClass = 'tweetOdd';
				}
				else {
					tableClass = 'tweetEven';
				}
				data += "<tr style='border: 1px solid black'>";
				data += "<td class='" + tableClass + "'>";
				data += "<img src='" + tweets.results[i].profile_image_url + "'/>";
				data += "</td>";
				data += "<td class='" + tableClass + "'>";
				data += "<b>" + tweets.results[i].from_user + "</b><br/>";
				data += tweets.results[i].text + "<br/>";
				data += tweets.results[i].created_at;
				data += "</td>";
				data += "</tr>";
			}
			data += "</table>";
			*/
			var logfile = document.getElementById("logfile");
			logfile.innerHTML = data;
		}
	}
}
console.log("asking for tweets");
request.send();
}

function postData() {
	console.log("postData");
	formData = {
		// all your parameters here
		logfile: $("#logfile"),
		test: 'test'
	}

	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: "http://192.168.1.220:8080/myapp/myresource/insert",
		dataType: "json",
		data: formData,
		success: function(data) {
			console.log("Post ok")
		},
		error: function(data) {
			console.log("Failed " + data)
		}
	});
	console.log("ajax was called");

}

function win(r) {
	console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	console.log("Sent = " + r.bytesSent);
}

function fail(error) {
	alert("An error has occurred: Code = " + error.code);
	console.log("upload error source " + error.source);
	console.log("upload error target " + error.target);
}

