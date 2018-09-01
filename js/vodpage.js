//finding vars
console.log("OVO");

//create a button, matching the CSS of twitch
function constructButton(mainText, id, pad) {
	var container = document.createElement("div");
	if(pad) {
		container.classList.add("tw-pd-x-1");
	}
	var twitchStyleButton = document.createElement("button");
	twitchStyleButton.classList.add("tw-interactive");
	twitchStyleButton.classList.add("tw-button");
	var twitchStyleButtonSubclass = document.createElement("span");
	twitchStyleButtonSubclass.classList.add("tw-button__text");
	var twitchStyleButtonSubclassText = document.createElement("div");
	twitchStyleButtonSubclassText.classList.add("tw-flex");
	twitchStyleButtonSubclassText.insertAdjacentHTML("afterBegin","<span>"+mainText+"</span>");
	twitchStyleButton.setAttribute("id", id);
	twitchStyleButtonSubclass.insertAdjacentHTML("afterBegin",twitchStyleButtonSubclassText.outerHTML);
	twitchStyleButton.insertAdjacentHTML("afterBegin",twitchStyleButtonSubclass.outerHTML);
	container.insertAdjacentHTML("afterBegin",twitchStyleButton.outerHTML)
	return container;
}
//create an input field, matching the CSS of twitch
function constructField(id, placeholder) {
	var twitchStyleField = document.createElement("input");
	twitchStyleField.setAttribute("id",id);
	twitchStyleField.setAttribute("placeholder",placeholder);
	twitchStyleField.classList.add("tw-border-radius-medium");
	twitchStyleField.classList.add("tw-font-size-6");
	twitchStyleField.classList.add("tw-textarea");
	twitchStyleField.classList.add("tw-textarea--no-resize");
	return twitchStyleField;
}

window.onload = function(){
	chrome.storage.sync.get(['savedHighlights'], function(result) {
		if(result.savedHighlights == null) {
		  chrome.storage.sync.set({savedHighlights: {"vod0":[]}}, function(){});
		}
	})
	var injectionPoint = document.querySelector("div.video-info-bar__action-container")
	injectionPoint.insertAdjacentHTML("afterBegin",constructButton("-10s","tenUnder",true).outerHTML)
	injectionPoint.insertAdjacentHTML("afterBegin",constructButton("-5s","fiveUnder",false).outerHTML)
	injectionPoint.insertAdjacentHTML("afterBegin",constructButton("Highlight Now","masterButton",true).outerHTML)
	injectionPoint.insertAdjacentHTML("afterBegin",constructField("highlightName","Highlight  Name").outerHTML)
	document.getElementById("masterButton").onclick = highlight0;
	document.getElementById("fiveUnder").onclick = highlight5;
	document.getElementById("tenUnder").onclick = highlight10;
	//chrome.storage.sync.get(['pendingaddition'], function(result) {
	//  if(isNaN(result.pendingaddition) || result.pendingaddition == null) {
	  //chrome.storage.sync.set({pendingaddition: -1}, function(){});
	  //pending = 0;
	//  } else {
	  //pending = result.pendingaddition;
	//  }
  //});
}
function highlight0() {
	highlight(0);
}
function highlight5() {
	highlight(5);
}
function highlight10() {
	highlight(10);
}
function highlight(timeMod) {
	var seekTime = document.querySelector("span.player-seek__time");
	var highlightName = document.getElementById("highlightName");
	var locale = window.location.href;
	var vodID = locale.replace("https://www.twitch.tv/videos/","")
	if(vodID.indexOf("?" > 0)) {
		vodID = vodID.substring(-1,vodID.indexOf("?"))
	}
	var saveData = {}
	saveData.name = highlightName.value;
	var timeData = seekTime.innerHTML.split(":");
	console.log(timeData);
	if((parseInt(timeData[2]) - timeMod) < 0) {
		if((parseInt(timeData[1]) - 1) < 0) {
			timeData[0] = parseInt(timeData[0]) - 1;
			timeData[1] = 59;
		} else {
			timeData[1] = parseInt(timeData[1]) - 1;
		}
		timeData[2] = parseInt(timeData[2]) + 60 - timeMod;
	} else {
		timeData[2] = parseInt(timeData[2]) - timeMod;
	}
	timeData.forEach(function(no){
		if(parseInt(no) < 10) {
			console.log("h")
			no = "0"+no;
		}
	});
	console.log(timeData);
	saveData.time = timeData[0]+":"+timeData[1]+":"+timeData[2];
	console.log(JSON.stringify(saveData));
	chrome.storage.sync.get(['savedHighlights'], function(result) {
		console.log(result)
		if(result.savedHighlights.hasOwnProperty('vod'+vodID)) {
			console.log("a")
			result['savedHighlights']['vod'+vodID].push(saveData);	
		} else {
			console.log("b")
			result['savedHighlights']['vod'+vodID] = [];
			result['savedHighlights']['vod'+vodID].push(saveData);
		}
		console.log(JSON.stringify(result.savedHighlights));
		console.log(result.savedHighlights)
		//console.log(result.savedHighlights[0])
		chrome.storage.sync.set({savedHighlights: result.savedHighlights}, function(){
			console.log("saved!")
		});
	})
}
// httpGet() function copied from:
// http://stackoverflow.com/questions/10642289/return-html-content-as-a-string-given-url-javascript-function
function httpGet(theUrl) {
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            return xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", theUrl, false );
    xmlhttp.send();
	return xmlhttp.responseText;
}
