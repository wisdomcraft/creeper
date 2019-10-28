
function main(){
    var host    = window.location.host;
	if(!host_check(host)) return false;
    
    var url     = window.location.href;
    
	var div     = document.createElement("div");
    div.style.margin    = "0";
    div.style.padding   = "0";
    div.style.position  = "fixed";
	div.style.top       = "60px";
	div.style.left      = "30px";
    div.style.width     = "auto";
    div.style.height    = "auto";
    div.style.overflow  = "hidden";
    div.style.border    = "1px solid #000000";
	div.style.zIndex 	= '999';
	div.innerHTML       = '';
    
    if(url==='http://cpquery.cnipa.gov.cn/' || url.indexOf("http://cpquery.cnipa.gov.cn/txnIndex.do")!==-1 || url.indexOf("http://cpquery.cnipa.gov.cn/#")!==-1 || url.indexOf("http://cpquery.cnipa.gov.cn/?")!==-1){
        div.innerHTML      += '<p><input type="button" id="cpquerycnipa_filluser" value="填写账密" style="margin:5px 0;cursor:pointer;" /></p>';
        document.body.insertBefore(div, document.body.firstElementChild);
        document.getElementById("cpquerycnipa_filluser").onclick = function(){
            cpquerycnipa_filluser();
        }
		cpquerycnipa_filluser();
    }
	
	if(url.indexOf("http://cpquery.cnipa.gov.cn/txnDisclaimerDetail.do") !== -1){
		window.location.href = 'http://cpquery.cnipa.gov.cn/txnQueryOrdinaryPatents.do';
	}
    
	if(url.indexOf("http://cpquery.cnipa.gov.cn/txnPantentInfoList.do") !== -1){
        div.innerHTML      += '<p><input type="button" id="txnPantentInfoList" value="点击跳转" style="margin:5px 0;cursor:pointer;" /></p>';
        document.body.insertBefore(div, document.body.firstElementChild);
        document.getElementById("txnPantentInfoList").onclick = function(){
            window.location.href = 'http://cpquery.cnipa.gov.cn/txnQueryOrdinaryPatents.do';
        }
		window.location.href = 'http://cpquery.cnipa.gov.cn/txnQueryOrdinaryPatents.do';
    } 
	
    if(url.indexOf("http://cpquery.cnipa.gov.cn/txnQueryOrdinaryPatents.do") !== -1){
        div.innerHTML      += '<p><input type="button" id="fetch_patent" value="获取专利" style="margin:5px 0;cursor:pointer;" /></p>';
        div.innerHTML      += '<p><input type="button" id="filter" value="点击采集" style="margin:5px 0;cursor:pointer;" /></p>';
        div.innerHTML      += '<p><input type="button" id="auto" value="自动采集" style="margin:5px 0;cursor:pointer;" /></p>';
        document.body.insertBefore(div, document.body.firstElementChild);
		document.getElementById("fetch_patent").onclick = function(){
            fetch_patent_txnQueryOrdinaryPatents();
        }
        document.getElementById("filter").onclick = function(){
            filter();
        }
		document.getElementById("auto").onclick = function(){
            //auto();
            alert('警告, 该功能暂时无效!');
        }
    }
	
	if(url.indexOf("http://cpquery.cnipa.gov.cn/txnQueryBibliographicData.do") !== -1){
        div.innerHTML      += '<p><input type="button" id="txnQueryBibliographicData_change_patent" value="换专利号" style="margin:5px 0;cursor:pointer;" title="更换专利申请号" /></p>';
		div.innerHTML      += '<p><input type="button" id="filter" value="点击采集" style="margin:5px 0;cursor:pointer;" /></p>';
		div.innerHTML      += '<p><input type="button" id="goto_txnQueryOrdinaryPatents" value="至搜索页" style="margin:5px 0;cursor:pointer;" title="跳转至专利搜索页" /></p>';
		div.innerHTML      += '<p><input type="button" id="txnQueryBibliographicData_auto" value="自动采集" style="margin:5px 0;cursor:pointer;" title="开启专利的自动采集" /></p>';
		div.innerHTML      += '<p><input type="button" id="txnQueryBibliographicData_autostop" value="停止自采" style="margin:5px 0;cursor:pointer;" title="停止专利的自动采集" /></p>';
        document.body.insertBefore(div, document.body.firstElementChild);
        document.getElementById("filter").onclick = function(){
            filter();
        }
		document.getElementById("txnQueryBibliographicData_change_patent").onclick = function(){
            txnQueryBibliographicData_change_patent();
        }
		document.getElementById("goto_txnQueryOrdinaryPatents").onclick = function(){
            window.location.href = 'http://cpquery.cnipa.gov.cn/txnQueryOrdinaryPatents.do';
        }
		document.getElementById("txnQueryBibliographicData_auto").onclick = function(){
            txnQueryBibliographicData_auto();
        }
		document.getElementById("txnQueryBibliographicData_autostop").onclick = function(){
            txnQueryBibliographicData_autostop();
        }
	}
	
	if(url.indexOf("http://epub.cnipa.gov.cn/overTran.action")!==-1){
        div.innerHTML      += '<p><input type="button" id="epub_cnipa_overTran" value="点击采集" style="margin:5px 0;cursor:pointer;" /></p>';
        document.body.insertBefore(div, document.body.firstElementChild);
        document.getElementById("epub_cnipa_overTran").onclick = function(){
            epub_cnipa_overTran();
        }
    }
	
	if(url.indexOf("http://epub.cnipa.gov.cn/pam.action")!==-1){
        div.innerHTML      += '<p><input type="button" id="epub_cnipa_pam" value="点击采集" style="margin:5px 0;cursor:pointer;" /></p>';
        document.body.insertBefore(div, document.body.firstElementChild);
        document.getElementById("epub_cnipa_pam").onclick = function(){
            epub_cnipa_pam();
        }
    }
	
	if(url.indexOf("http://www.patentstar.cn/frmLogin.aspx")!==-1){
        div.innerHTML      += '<p><input type="button" id="patentstar_filluser" value="填写账密" style="margin:5px 0;cursor:pointer;" /></p>';
        document.body.insertBefore(div, document.body.firstElementChild);
        document.getElementById("patentstar_filluser").onclick = function(){
            patentstar_filluser();
        }
		patentstar_filluser();
    }
}


window.onload = function(){main(); setTimeout("txnQueryBibliographicData_auto_execute()", 1000);};


function host_check(host){
    var host_array = [
        'cpquery.cnipa.gov.cn',
        'epub.cnipa.gov.cn',
        'www.patentstar.cn'
    ];

    for(var i=0;i<host_array.length;i++){
        if(host === host_array[i]) return true;
    }
    return false;
}
