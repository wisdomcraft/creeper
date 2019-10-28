
/*
* 对该网址的采集
* http://epub.cnipa.gov.cn/overTran.action
*/
function epub_cnipa_pam(){
	var sendData	= epub_cnipa_pam_gather();
	if(sendData === false)	return false;
	
    chrome.extension.sendMessage(sendData, function(receiveData){
		console.log('content_cnipa_epub_pam.js #11');
        console.log(receiveData);
		if(receiveData === undefined){
			alert('error, 当前返回信息undefined, 网络可能错误, content_cnipa_epub_pam.js #14');
			return false;
		}
		if(receiveData.status === 'success'){
			alert('success');
		}else{
			alert(receiveData.message);
		}
    });
}

function epub_cnipa_pam_gather(){
	var url 	= (window.location.href).replace(window.location.search, '');
	if(url !== "http://epub.cnipa.gov.cn/pam.action"){
		alert("error, url is not allowed, content_cnipa_epub_pam.js #26");
    	return false;
	}
	
	var html	= document.getElementsByTagName('html')[0].innerHTML;
	if(html.indexOf("没有您要查询的结果") !== -1){
		alert("错误, 没有专利信息数据, content_cnipa_epub_pam.js #34");
		return false;
	}
	if(html.indexOf("d.strWhere.value") === -1){
		alert("错误, 没有专利公布公开文献编号, content_cnipa_epub_pam.js #38");
		return false;
	}
	if(html.indexOf("javascript:sw_xx") === -1){
		alert("错误, 没有专利申请号, content_cnipa_epub_pam.js #42");
		return false;
	}
	if(html.indexOf("images/down.jpg") === -1){
		alert("错误, 没有专利下载链接, content_cnipa_epub_pam.js #46");
		return false;
	}
	
	var start 	= html.indexOf('setup(d)');
	var end		= html.indexOf('</head>');
	if(start === -1){
		alert('错误, 数据截取的开始值为-1, content_cnipa_epub_pam.js #53');
		return false;
	}
	if(end === -1){
		alert('错误, 数据截取的结尾值为-1, content_cnipa_epub_pam.js #57');
		return false;
	}
	if(start >= end){
		alert('错误, 数据截取时出错, 数据开始值大于结尾值, content_cnipa_epub_pam.js #61');
		return false;
	}
	var data	= html.slice(start, end-10);
	data        = data.trim();
	
	var start2 	= html.indexOf('<dd><ul>');
	var end2	= html.indexOf('</ul></dd>');
	if(start2 === -1){
		alert('错误, 数据截取的开始值为-1, content_cnipa_epub_pam.js #73');
		return false;
	}
	if(end2 === -1){
		alert('错误, 数据截取的结尾值为-1, content_cnipa_epub_pam.js #77');
		return false;
	}
	if(start2 >= end2){
		alert('错误, 数据截取时出错, 数据开始值大于结尾值, content_cnipa_epub_pam.js #81');
		return false;
	}
	var data2	= html.slice(start2, end2+10);
	data2      	= data2.trim();
	
	data 		= data + data2;
	
	var jsonObject 		= new Object();
	jsonObject.action 	= 'post_data';
	jsonObject.url 		= url;
	jsonObject.html		= data;
	var jsonString 		= JSON.stringify(jsonObject);
    console.log('content_cnipa_epub.js #94' + jsonString);
    return jsonObject;
}
