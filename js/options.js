/*
** file: js/options.js
** description: javascript code for "html/options.html" page
*/
document.getElementById('btn').onclick = function() {
  if(document.getElementById('budget').value > 0) {
    chrome.storage.sync.set({budget: parseFloat(document.getElementById('budget').value).toFixed(2)}, function() {
         console.log('Value is set to ' + document.getElementById('budget').value);
    });
  }
  if(document.getElementById('total').value > 0) {
    chrome.storage.sync.set({total: parseFloat(document.getElementById('total').value).toFixed(2)}, function() {
         console.log('Value is set to ' + document.getElementById('total').value);
    });
  }
  if(document.getElementById('defaultname').value != "") {
    chrome.storage.sync.set({defaultname: document.getElementById('defaultname').value}, function() {
         console.log('Value is set to ' + document.getElementById('defaultname').value);
    });
  }
  if(document.getElementById('defaultamount').value > 0) {
    chrome.storage.sync.set({defaultamount: document.getElementById('defaultamount').value}, function() {
         console.log('Value is set to ' + document.getElementById('defaultamount').value);
    });
  }
}
document.getElementById('destroyIt').onclick = function() {
  var r = confirm("Clear all data?")
  if(r) {
    chrome.storage.sync.set({total: null}, function() {
    });
    chrome.storage.sync.set({budget: null}, function() {
    });
    chrome.storage.sync.set({pending: null}, function() {
    });
    chrome.storage.sync.set({defaultname: null}, function() {
    });
    chrome.storage.sync.set({defaultamount: null}, function() {
    });
    chrome.storage.local.set({sounds: null}, function() {
    });
  } else {
    alert("Did not clear data")
  }
}
