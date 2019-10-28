
/*
* 对该网址的采集
* http://epub.cnipa.gov.cn/overTran.action
*/
function epub_cnipa_overTran(){
	var sendData	= epub_cnipa_overTran_gather();
	if(sendData === false)	return false;
	
    chrome.extension.sendMessage(sendData, function(receiveData){
		console.log('content_cnipa_epub.js #11');
        console.log(receiveData);
		if(receiveData === undefined){
			alert('error, 当前返回信息undefined, 网络可能错误, content_cnipa_epub.js #14');
			return false;
		}
		if(receiveData.status === 'success'){
			alert('success');
		}else{
			alert(receiveData.message);
		}
    });
}

function epub_cnipa_overTran_gather(){
	var url 	= (window.location.href).replace(window.location.search, '');
	if(url !== "http://epub.cnipa.gov.cn/overTran.action"){
		alert("error, url is not allowed, content_cnipa_epub.js #26");
    	return false;
	}
	
	var html	= document.body.innerHTML;
	if(html.indexOf("没有您要查询的结果") !== -1){
		alert("错误, 没有专利信息数据, content_cnipa_epub.js 32");
		return false;
	}
	if(html.indexOf("javascript:sw_xx") === -1){
		alert("错误, 没有专利信息数据, content_cnipa_epub.js 34");
		return false;
	}
	
	var start 	= html.indexOf('<table width="100%" border="0" cellpadding="0" cellspacing="0">');
	var end		= html.indexOf('</table>');
	if(start === -1){
		alert('错误, 数据截取的开始值为-1, content_cnipa_epub.js #41');
		return false;
	}
	if(end === -1){
		alert('错误, 数据截取的结尾值为-1, content_cnipa_epub.js #44');
		return false;
	}
	var data	= html.slice(start, end);
	data        = data.trim();
	
	var jsonObject 		= new Object();
	jsonObject.action 	= 'post_data';
	jsonObject.url 		= url;
	jsonObject.html		= data;
	var jsonString 		= JSON.stringify(jsonObject);
    console.log('content_cnipa_epub.js #46' + jsonString);
    return jsonObject;
}
