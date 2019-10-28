
function cpquerycnipa_filluser(){
    document.getElementById("username").value   = '130637198605081810';
    document.getElementById("password").value   = 'Extrahuman@2018';
    
    document.getElementById("username1").value  = '18801456251';
    document.getElementById("password1").value  = 'EXtrahuman@198658';
}


/*
* 给该网页提交一个专利申请号, 专利搜索页
* http://cpquery.cnipa.gov.cn/txnQueryOrdinaryPatents.do
*/
function fetch_patent_txnQueryOrdinaryPatents(){
	var sendData 	= new Object();
	sendData.action	= 'fetch_patent';
	
	chrome.extension.sendMessage(sendData, function(receiveData){
        console.log('content_cnipa_cpquery.js #82');
		console.log(receiveData);
		if(receiveData.status === 'success'){
			if(receiveData.count < 1){
				alert('error, 获取专利号的数量为0, content_cnipa_cpquery.js #83');
				return false;
			}
			var patent = receiveData.data[0];
			document.getElementById("select-key:shenqingh").value = patent;
		}else{
			alert(receiveData.message);
		}
    });
}


/*
* 给当前网页, 更新一个专利申请号, 专利“申请信息”页
* http://cpquery.cnipa.gov.cn/txnQueryBibliographicData.do
*/
function txnQueryBibliographicData_change_patent(){
	var query = window.location.search;
	var token_match = /token=([A-Z0-9]+)&/.exec(query);
	var token		= null;
	if(token_match!==null && token_match.length==2) token = token_match[1];
	if(token === null){
		alert('error, token获取失败, content_cnipa_cpquery.js #128');
		return false;
	}
	
	var sendData 	= new Object();
	sendData.action	= 'fetch_patent';
	chrome.extension.sendMessage(sendData, function(receiveData){
        console.log('content_cnipa_cpquery.js #137');
		console.log(receiveData);
		if(receiveData.status === 'success'){
			if(receiveData.count < 1){
				alert('error, 获取专利号的数量为0, content_cnipa_cpquery.js #141');
				return false;
			}
			var patent 	= receiveData.data[0];
			var url 	= 'http://cpquery.cnipa.gov.cn/txnQueryBibliographicData.do?select-key:shenqingh='+ patent +'&token=' + token + '&';
			window.location.href = url;
		}else{
			alert(receiveData.message);
		}
    });
}


function filter(){
    var host        = window.location.host;
    var sendData    = null;
    switch(host){
        case "cpquery.cnipa.gov.cn":
            sendData = cpquerysipo();
            break;
        default:
            alert("错误, 不支持对该站点采集, content_cnipa_cpquery.js #78");
            return false;
    }
	
    if(sendData === false)	return false;
	
    chrome.extension.sendMessage(sendData, function(receiveData){
		console.log('content_cnipa_cpquery.js #85');
        console.log(receiveData);
		if(receiveData.status === 'success'){
			alert('success');
		}else{
			alert(receiveData.message);
		}
    });
}


/*
* ******************************************************************
* 开始对该站点的采集
* http://cpquery.cnipa.gov.cn/
* ******************************************************************
*/
function cpquerysipo(){
    var url = window.location.href;
    if(url.indexOf("http://cpquery.cnipa.gov.cn/txnQueryOrdinaryPatents.do") === 0){
        return cpquerysipo_txnQueryOrdinaryPatents();
    }else if(url.indexOf("http://cpquery.cnipa.gov.cn/txnQueryBibliographicData.do") === 0){
		return cpquerysipo_txnQueryBibliographicData();
	}
    
    alert("error, url is not allowed, content_cnipa_cpquery.js #84");
    return false;
}


/*
* 对该网址的采集
* http://cpquery.cnipa.gov.cn/txnQueryOrdinaryPatents.do
*/
function cpquerysipo_txnQueryOrdinaryPatents(){
	var url 	= (window.location.href).replace(window.location.search, '');
	
    var html 	= document.body.innerHTML;
	if(html.indexOf("welcome") !== -1){
		alert("错误, 没有专利数据, content_cnipa_cpquery.js #47");
		return false;
	}
	if(html.indexOf("content_boxx") === -1){
		alert("错误, 没有专利数据, 请联系管理员, content_cnipa_cpquery.js #51");
		return false;
	}
	
	var start 	= html.indexOf('class="content_boxx">') + ('class="content_boxx">').length;
	var end		= html.indexOf("</table>", start) + ("</table>").length;
	var data	= html.slice(start, end);
	data        = data.trim();

	var jsonObject 		= new Object();
	jsonObject.action 	= 'post_data';
	jsonObject.url 		= url;
	jsonObject.html		= data;
	var jsonString 		= JSON.stringify(jsonObject);
    console.log('content_cnipa_cpquery.js #108' + jsonString);
    return jsonObject;
}


/*
* 对该网址的采集
* http://cpquery.cnipa.gov.cn/txnQueryBibliographicData.do
*/
function cpquerysipo_txnQueryBibliographicData(){
	var url 	= (window.location.href).replace(window.location.search, '');
	
    var html 	= document.body.innerHTML;
	if(html.indexOf("tab_box") === -1){
		alert("错误, 没有专利数据, content_cnipa_cpquery.js #239");
		return false;
	}
	if(html.indexOf('class="ft"') === -1){
		alert("错误, 没有专利数据, 请联系管理员, content_cnipa_cpquery.js #243");
		return false;
	}
	
	var patent_match	= /record_zlx:shenqingh\" title=\"([a-zA-Z0-9]+)\">/.exec(html);
	if(patent_match===null || patent_match.length!==2){
		var application_number 			= null;
		var application_number_match 	= /select-key:shenqingh=([A-Z0-9]+)&/.exec(window.location.search);
		if(application_number_match!==null && application_number_match.length===2) application_number = application_number_match[1];
		if(application_number !== null)
			report_error('application number: ' + application_number + ', Basic information is empty in ' + url);
		alert('错误, 专利数据不存在, content_cnipa_cpquery.js #258');
		return false;
	}
	
	var start 	= html.indexOf('<div class="tab_box">');
	var end		= html.indexOf('<div class="ft">');
	if(start === -1){
		alert('错误, 数据截取的开始值为-1, content_cnipa_cpquery.js #177');
		return false;
	}
	if(end === -1){
		alert('错误, 数据截取的结尾值为-1, content_cnipa_cpquery.js #182');
		return false;
	}
	var data	= html.slice(start, end);
	data        = data.trim();

	var jsonObject 		= new Object();
	jsonObject.action 	= 'post_data';
	jsonObject.url 		= url;
	jsonObject.html		= data;
	var jsonString 		= JSON.stringify(jsonObject);
    console.log('content_cnipa_cpquery.js #111' + jsonString);
    return jsonObject;
}


function report_error(message){
	var sendData 		= new Object();
	sendData.action		= 'report_error';
	sendData.message	= message;
	chrome.extension.sendMessage(sendData, function(receiveData){
		console.log('response about report error, content_cnipa_cpquery.js #195');
        console.log(receiveData);
    });
}
