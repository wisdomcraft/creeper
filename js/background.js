chrome.extension.onMessage.addListener(function(receiveRequest, _, sendResponse){
    console.log(receiveRequest);
    var data = JSON.stringify(receiveRequest);
	var xmlhttp;
	
	if(window.XMLHttpRequest){
		xmlhttp	= new XMLHttpRequest();
	}else{
		xmlhttp	= new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState==4 && xmlhttp.status==200){
			var html 	= xmlhttp.responseText;
			console.log(html);
			html     	= html.trim();
			var object 	= JSON.parse(html);
			sendResponse(object);
		}
	}
  
	//true, asynchronous; false, synchronous
	xmlhttp.open("POST", "http://plug.patentinfos.com/patent/index.php", false);
	xmlhttp.setRequestHeader('Content-Type', 'application/json');
	xmlhttp.send(data);
});