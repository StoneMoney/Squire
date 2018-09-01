
function loadTables() {
	chrome.storage.sync.get(['savedHighlights'], function(result) {
		if(result.savedHighlights == null) {
		  chrome.storage.sync.set({savedHighlights: {"vod0":[]}}, function(){});
		} else {
			console.log("h")
			var container = document.getElementById("tables")
			var keys = Object.keys(result.savedHighlights);
			for(i = 1; i <= keys.length; i++) {
				console.log(i);
				console.log(keys.length);
				var table = document.createElement("table")
				table.classList.add(keys[i])
				var tbody = document.createElement("tbody")
				tbody.setAttribute("id","table"+keys[i])
				result.savedHighlights[keys[i]].forEach(function(item) {
					var tr = document.createElement("tr")
					tr.setAttribute("id","parent"+keys[i]+"||"+item.time)
					var td1 = document.createElement("td")
					var td2 = document.createElement("td")
					var td3 = document.createElement("td")
					td1.classList.add("timestamp")
					td1.setAttribute("id",keys[i]+"||"+item.time)
					td2.classList.add("name")
					//td1.setAttribute("onclick","deleteWarn("+keys[i]+item.time+")")
					//td1.setAttribute("ondblclick","deleteItem("+keys[i]+","+item.time+")");
					td1.insertAdjacentHTML("afterBegin",item.time)
					td2.insertAdjacentHTML("afterBegin",item.name)
					tr.insertAdjacentHTML("afterBegin",td2.outerHTML)
					tr.insertAdjacentHTML("afterBegin",td1.outerHTML)
					tbody.insertAdjacentHTML("beforeEnd",tr.outerHTML)
				});
				table.insertAdjacentHTML("afterBegin",tbody.outerHTML)
				table.insertAdjacentHTML("beforeEnd","<br>")
				table.insertAdjacentHTML("beforeEnd","<span class='"+keys[i]+"'>"+keys[i]+"</span>&nbsp;<button id='"+keys[i]+"button' class='"+keys[i]+" delbutton'>Delete</button><br class='"+keys[i]+"'>")
				container.insertAdjacentHTML("beforeEnd",table.outerHTML)
				if(i+1 == keys.length) {
					displayTables(container);
				}
			}
		}
	});
}
function displayTables(code) {
	console.log("a")
	//document.getElementById("tables").insertAdjacentHTML("afterBegin",code.outerHTML);
	var timeStampCells = document.getElementsByClassName("timestamp");
	for(i = 0; i < timeStampCells.length; i++) {
		timeStampCells[i].addEventListener("click", deleteWarn, false);
		timeStampCells[i].addEventListener("dblclick", deleteItem, false);
	}
	var deleteButtons = document.getElementsByClassName("delbutton");
	for(i = 0; i < timeStampCells.length; i++) {
		deleteButtons[i].addEventListener("click", deleteWarn, false);
		deleteButtons[i].addEventListener("dblclick", deleteVod, false);
	}
}
function deleteWarn(e) {
	console.log("A")
	var element =  e.target;
	if (typeof(element) != 'undefined' && element != null)
	{
	  element.classList.add("deleteWarn");
	  setTimeout(function(){
		element.classList.remove("deleteWarn");
	  },1000)
	}
}
function deleteItem(e) {
	console.log("B")
	var element =  e.target;
	if (typeof(element) != 'undefined' && element != null)
	{
	  chrome.storage.sync.get(['savedHighlights'], function(result) {
		var eData = element.id.split("||");
		var count = 0;
		result.savedHighlights[eData[0]].forEach(function(j){
			if(j.time == eData[1]) {
				document.getElementById("table"+eData[0]).removeChild(document.getElementById("parent"+element.id));
				result.savedHighlights[eData[0]].splice([count],1);
				if(result.savedHighlights[eData[0]].length == 0) {
					delete result.savedHighlights[eData[0]]
					var delStuff = document.getElementsByClassName(eData[0]);
					console.log(delStuff)
					var delLength = delStuff.length;
					for(i = 0; i < delLength; i++) {
						delStuff[i].style.visibility = "hidden";
					}
					save(result);
				} else {
					save(result);
				}
			} else {
				count++;
			}
		})
	  })
	}
}
function deleteVod(e) {
	var eData = e.target.id.replace("button","")
	chrome.storage.sync.get(['savedHighlights'], function(result) {
		delete result.savedHighlights[eData]
		var delStuff = document.getElementsByClassName(eData);
		console.log(delStuff)
		var delLength = delStuff.length;
		for(i = 0; i < delLength; i++) {
			delStuff[i].style.visibility = "hidden";
		}
		save(result);
	})
}
function save(result) {
	chrome.storage.sync.set({savedHighlights: result.savedHighlights}, function(){});
}
window.onload = function(){
	loadTables();
}
document.getElementById("clear").onclick = clear;
function clear() {
	chrome.storage.sync.set({savedHighlights: {"vod0":[]}}, function(){});
}

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
//bind events to dom elements
