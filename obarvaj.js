// ==UserScript==
// @name           obarvaj
// @namespace      https://torrentbytes.net/
// @description    Obarva top shiat
// @include        https://torrentbytes.net/*
// @require       http:////ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @resource	 customCSS2 https://dl.dropboxusercontent.com/u/521104/css/progress.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// ==/UserScript==
var newCSS = GM_getResourceText ("customCSS2");
GM_addStyle (newCSS);

/* dbg
var e = document.createElement("script");
e.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
e.type="text/javascript";
document.getElementsByTagName("head")[0].appendChild(e);

var e2 = document.createElement("script");
e2.src = 'https://dl.dropboxusercontent.com/u/521104/skripte/dbg/obarvaj.js';
e2.type="text/javascript";
document.getElementsByTagName("head")[0].appendChild(e2);
*/

function progress(percent, $element) {
	
		var progressBarWidth = percent * $element.width() / 100;
		$element.find('div').animate({ width: progressBarWidth }, 1500).html(percent + "%&nbsp;");		
	}

function start()
 {
    var tables = document.body.getElementsByTagName("table");

    var table;
    var rightTable = -1;
    var seedersId = -1, leechersId = -1;
    /*// Najdi pravo tabelo*/
    for (i = 0; i < tables.length; i++) 
    {
        var tr = tables[i].getElementsByTagName("tr");
        for (j = 0; j < tr.length; j++) 
        {
            var td = tr[j].getElementsByTagName("td");
            if (td.length > 7) 
            {
                if (td[0].innerHTML == "Type") 
                {                    
                    rightTable = i;                    
                } 
            } 
        } 
    } 
    if (rightTable == -1) 
    {
        //alert('Ne najdem prave tabele');
        return;
    }
    //alert('boo');
    var snatched = 0;
    var avg = 0;
    var trs = tables[rightTable].getElementsByTagName("tr");
    
	
	/*najdemo Seeders stolpec*/
	var tds = trs[0].getElementsByTagName("td");
	for (k = 0;k < trs.length;k++) 
	{

		if ($(tds[k]).text().indexOf('Seeders') > -1 && $(tds[k]).text().length <=14 ) 
		{
			seedersId = k;
			break;
		} 
	} 
	
	
	/*najdemo Leechers stolpec*/
	tds = trs[0].getElementsByTagName("td");
	for (k = 0;k < trs.length;k++) 
	{
		if ($(tds[k]).text().indexOf('Leechers') > -1 && $(tds[k]).text().length <=14 ) 
		//if (tds[k].innerHTML.indexOf('Leechers') > -1 && tds[k].innerHTML.length <=14 ) 
		{
			leechersId = k;
			break;
		} 
	} 
	/*
	alert('1-'+seedersId);
	alert(seedersId + ' - ' + leechersId);
	*/
    

	
    /*// Najdi max in avg snatched*/
    for (i = 1;i < trs.length;i++) 
    {                
        var itemS = trs[i].getElementsByTagName("td")[seedersId];
        var valueS = parseInt(itemS.innerHTML.replace(/[^0-9]/g, ""));
		
		var itemL = trs[i].getElementsByTagName("td")[leechersId];
        var valueL = parseInt(itemL.innerHTML.replace(/[^0-9]/g, ""));
		
		var value = valueS + valueL;
		
        if (value > snatched) 
            snatched = value;
        avg = avg + value;
    } 
    
    avg = avg / (trs.length - 1);
    
    /*alert(snatched);
    */
    /*// obarvaj...*/
    
    var limit = snatched - (snatched * 0.3);
    /*limit je 30% odmik od max-a*/
    for (i = 1; i < trs.length;i++) 
    {
        var itemS = trs[i].getElementsByTagName("td")[seedersId];
        var valueS = parseInt(itemS.innerHTML.replace(/[^0-9]/g, ""));
		
		var itemL = trs[i].getElementsByTagName("td")[leechersId];
        var valueL = parseInt(itemL.innerHTML.replace(/[^0-9]/g, ""));
		
		var value = valueS + valueL;
		
        if (value > limit) 
        {
            trs[i].bgColor = "#aa6666";
			
			$(trs[i]).css("color","#ffffff");
			$(trs[i]).find("a").css("color","#ffffff");
			$(trs[i]).find("i").css("color","#ddd");
			$(trs[i]).find("font").css("color","#ddd");
        } else if (value > avg) 
        {
            trs[i].bgColor = "#6666aa";
			$(trs[i]).css("color","#ffffff");
			$(trs[i]).find("a").css("color","#ffffff");
			$(trs[i]).find("i").css("color","#ddd");
			$(trs[i]).find("font").css("color","#ddd");
        } 
		var res = Math.round(1000*value/snatched)/10;
		var target = $(trs[i]).children("td").eq(1);
		target.append('<div class="progressBar" id="myprogress_'+i+'"style="height:13px;background:#292929;color:#78919B;float:right;border:1px solid #777;width:50px;font-size:9px;text-align:right;"><div>' +''+ "</div></div>");
		
		setTimeout(		
			(function(s,val){
				return function(){
					progress(val, $(s));
				};
			})('#myprogress_'+i, res),
		200);
		
		/*imdb shiat*/
		var prevATit, imdbURL, mTitle, mTitleSplit;
		var visLen = 50;
		mTitle = $.trim(target.find('nobr a:last').text().toUpperCase());
		mTitleSplit = mTitle.substring(0, visLen).split('.');
		var vidArr=["PROPER","SUBBED","UNSUBBED","SWEDISH","COMPLETE","FIN","BLURAY-LAZ","LIMITED","MULTISUBS","HSBS","THEATRICAL","DUAL","UNRATED","XVID","REPACK","RECODE","DVDSCR","DVDRIP","DVD5","DVD9","DVDR","DVD","SCREENER", "CAM","CAMRIP","R3","R5","LINE","STV","TELESYNC","TS","TC","TELECINE","VHSRIP","WORKPRINT","WP","AC3","H264","BLURAYRIP","BLURAY","480P","576P","720P","1080P","X264", "AXXO","KLAXXON","KINGBEN","FXM","DASH","MAXSPEED","FXM","BULLDOZER","LTT","AKCPE","BESTDIVX","DIVXMONKEY","STG",".AVI","NO RARS","NORARS","NORAR","SWESUB","NLSUB","MULTISUB","YIFY","DTS","BRRIP","HD","WEBRIP","BDRIP","WEB","READNFO","WS","PDVD","Pre-DVD","PPV","SCR","DSR","PDTV","HDTV","DTHRIP","DTH","R4","","TVRIP","TV","BD5","BD9","V2","NL","EXTENDED","DUBBED","RERIP","FS","MP4","MKV","HI-DEF", "MULTI"];
		var cleanTitle='';
		prevATit = target.prev().find('a img').attr('title').toUpperCase();
		if (prevATit.indexOf('MOVIES') != -1) {
    		for(var mi=0; mi < mTitleSplit.length; mi++){
    		  if((vidArr.indexOf(mTitleSplit[mi]))!= -1)
    	           break;
    	      cleanTitle = cleanTitle + mTitleSplit[mi] + ' ';
    		}
    		cleanTitle = $.trim(cleanTitle.replace(/s\d+e\d+/i, '').replace('3D', ''));    		
    		var mTit = $.trim(cleanTitle.substring(0, cleanTitle.length-4));
    		var mYear = $.trim(cleanTitle.substring(cleanTitle.length-4, cleanTitle.length));
    		//console.log(mTit+"-"+mYear);
    		GM_xmlhttpRequest({
            	method: 'GET',
            	url: 'http://www.omdbapi.com/?t=' + mTit + '&y=' + mYear + '&r=json',
            	headers: {
        			'User-Agent': 'Mozilla/5.0',
        			'Accept': 'application/json'
  				},
  				onload: omdbAppend.bind({}, $.trim(cleanTitle), prevATit, target.find(".progressBar"))
            });
		}
    }
}

function omdbAppend(tit, pAT, tPB, response){
    var rJSON=$.parseJSON(response.responseText);
    if (rJSON.Response != 'False'){
        if(pAT.indexOf('MOVIES') != -1){
            if(rJSON.Type == 'movie'){
                 var imdbHtml = '<a rel="nofollow" style="float: right; padding-left: 2px;" title="IMDB" target="_blank" href="http://www.imdb.com/title/'+rJSON.imdbID+'/"><img title="" alt="" src="data:image/png;base64,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" /></a>'
                $(tPB).after(imdbHtml);
            }
        }
    }
}


	start();

 
