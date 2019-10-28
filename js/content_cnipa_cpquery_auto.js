
/*
* ******************************************************************
* gather by auto
* ******************************************************************
*/


/*
function auto(){
	var sendData    = null;
	var url 		= window.location.href;
	if(url.indexOf("http://cpquery.sipo.gov.cn/txnQueryOrdinaryPatents.do") === 0){
        sendData =  cpquerysipo_txnQueryBibliographicData_auto();
    }else{
		alert("error, url is not allowed, content_cpquerysipo_auto.js #84");
    	return false;
	}
	
    if(sendData === false || sendData=== null){
		alert('error, 未获取可发送的数据, content_cpquerysipo_auto.js #169');
		return false;
	};
	
    chrome.extension.sendMessage(sendData, function(receiveData){
        console.log('content_cpquerysipo_auto.js #195' + receiveData);
		if(receiveData.status === 'success'){
			cpquerysipo_txnQueryBibliographicData_auto_postdata(receiveData);
		}else{
			alert(receiveData.message);
		}
    });
}

function cpquerysipo_txnQueryBibliographicData_auto(){
	var html 	= document.body.innerHTML;
	if(html.indexOf("welcome") !== -1){
		//alert("错误, 当前token可能无效, 不支持自动采集, 请成功搜索一个专利号来获取可用token, content_cpquerysipo_auto.js #185");
		//return false;
	}
	
	var token_match = /sq_token\" value=\"([A-Z0-9]+)\">/.exec(html);
	var token		= null;
	if(token_match!==null && token_match.length==2) token = token_match[1];
	if(token === null){
		alert('error, sq_token获取失败, content_cpquerysipo_auto.js #279');
		return false;
	}
	if(token.length !== 32){
		alert('error, sq_token获取的长度错误, content_cpquerysipo_auto.js #283, token:' + token);
		return false;
	}
	
	var jsonObject 		= new Object();
	jsonObject.operate 	= 'auto';
	jsonObject.action	= 'fetch_url';
	jsonObject.sq_token	= 'token';
	jsonObject.project	= 'cpquerysipo_txnQueryBibliographicData';
	var jsonString 	= JSON.stringify(jsonObject);
    console.log('content_cpquerysipo_auto.js #111' + jsonString);
    return jsonObject;
}


function cpquerysipo_txnQueryBibliographicData_auto_postdata(receiveData){
	var url = receiveData.url;
	if(url === null){
		alert('error, 自动采集操作, 所获取的url为空, content_cpquerysipo_auto.js #215');
		return false;
	}
	
	if(url.indexOf("http://cpquery.sipo.gov.cn/txnQueryBibliographicData.do") === -1){
		alert('error, 自动采集操作, 所获取的url不正确, content_cpquerysipo_auto.js #220, url:' + url);
		return false;
	}
	window.location.href = receiveData.url + '&operate=auto';
}
*/


/*
* 点击, 开始该网页的自动采集
* http://cpquery.cnipa.gov.cn/txnQueryBibliographicData.do
*/
function txnQueryBibliographicData_auto(){
	var query		= window.location.search;
	var token_match = /token=([A-Z0-9]+)&/.exec(query);
	var token		= null;
	if(token_match!==null && token_match.length===2) token = token_match[1];
	if(token === null){
		console.log('error, token获取失败, it cannot enable auto gather, content_cnipa_cpquery_auto.js #91');
		return false;
	}
	var url			= window.location.href + '&operate=auto&';
	window.location.href = url;
}


function txnQueryBibliographicData_auto_execute(){
	var host	= window.location.host;
    if(host !== 'cpquery.cnipa.gov.cn') return false;
	
	var url		= window.location.href;
	if(url.indexOf("http://cpquery.cnipa.gov.cn/txnQueryBibliographicData.do") !== 0) return false;
	
	var query	= window.location.search;
	if(query.indexOf("operate=auto&") === -1){
		console.log('error,  parameter "operate=auto&" does not exist in url, auto gather stop here, content_cnipa_cpquery_auto.js #108');
		return false;
	}
		
	if(txnQueryBibliographicData_auto_execute_gather() === false) return false;
	
	var token_match = /token=([A-Z0-9]+)&/.exec(query);
	var token	= null;
	if(token_match!==null && token_match.length===2) token = token_match[1];
	if(token === null){
		console.log('error, token获取失败, auto gather stop here, content_cnipa_cpquery_auto.js 118');
		return false;
	}
	var sendData	= new Object();
	sendData.action	= 'fetch_patent';
	chrome.extension.sendMessage(sendData, function(receiveData){
        console.log('content_cnipa_cpquery_auto.js #124');
		console.log(receiveData);
		if(receiveData.status === 'success'){
			if(receiveData.count < 1){
				console.log('error, 获取专利号的数量为0, auto gather stop here, content_cnipa_cpquery_auto.js #128');
				return false;
			}
			var patent 	= receiveData.data[0];
			var url 	= 'http://cpquery.cnipa.gov.cn/txnQueryBibliographicData.do?select-key:shenqingh='+ patent +'&token=' + token + '&operate=auto&';
			window.location.href = url;
		}else{
			console.log('error, return status is not success, auto gather stop here, content_cnipa_cpquery_auto.js #135, ↓');
			console.log(receiveData.message);
		}
    });
}


function txnQueryBibliographicData_auto_execute_gather(){
	var url 	= (window.location.href).replace(window.location.search, '');
	
    var html 	= document.body.innerHTML;
	if(html.indexOf("tab_box") === -1){
		alert("错误, 没有专利数据, content_cnipa_cpquery_auto.js #147");
		return false;
	}
	if(html.indexOf('class="ft"') === -1){
		alert("错误, 没有专利数据, 请联系管理员, content_cnipa_cpquery_auto.js #151");
		return false;
	}
	
	var patent_match	= /record_zlx:shenqingh\" title=\"([a-zA-Z0-9]+)\">/.exec(html);
	if(patent_match===null || patent_match.length!==2){
		console.log('error, patent does not exist, auto gather stop here, content_cnipa_cpquery_auto.js #157');
		return true;
	}
	
	var start 	= html.indexOf('<div class="tab_box">');
	var end		= html.indexOf('<div class="ft">');
	var data	= html.slice(start, end);
	data        = data.trim();

	var jsonObject 		= new Object();
	jsonObject.action	= 'post_data';
	jsonObject.url 		= url;
	jsonObject.html		= data;
    console.log('content_cnipa_cpquery_auto.js #170' + JSON.stringify(jsonObject));
    
	var sendData = jsonObject;
	chrome.extension.sendMessage(sendData, function(receiveData){
		console.log('content_cnipa_cpquery_auto.js #174');
        console.log(receiveData);
		if(receiveData.status === 'success'){
			return true;
		}else{
			console.log('error, auto gather stop here, content_cnipa_cpquery_auto.js #179');
			alert(receiveData.message);
			return false;
		}
    });
}


function txnQueryBibliographicData_autostop(){
	var host	= window.location.host;
    if(host !== 'cpquery.cnipa.gov.cn'){
		alert('错误, 站点错误, content_cnipa_cpquery_auto.js #190');
		return false;
	}
	
	var url		= window.location.href;
	if(url.indexOf("http://cpquery.cnipa.gov.cn/txnQueryBibliographicData.do") !== 0){
		alert('错误, 网址错误, content_cnipa_cpquery_auto.js #196');
		return false;
	}
	
	if(url.indexOf("operate=auto&") === -1){
		alert('警告, 当前页面没有开启自动采集, 无需“停止自采”操作');
		return false;
	}
	
	url			= url.replace('operate=auto&', '');
	window.location.href = url;
}
