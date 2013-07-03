
function timestamp() {
  var ts_path = '//comment()';
  var evaluater = document.evaluate(ts_path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  var item = evaluater.snapshotItem(evaluater.snapshotLength-1);
  var matchobj = item.textContent.match(/chunked (.+) JST(.+)$/);
  return (new Date(matchobj[1]+matchobj[2])).getTime()/1000;
}

function makeResponseHandler(place, href, command) {
  var p=document.createElement("div");
  var l=document.createElement("a");
  l.setAttribute("href", href);
  l.innerText=command;
  p.appendChild(l);
  place.parentNode.insertBefore(p, place.nextSibling);
}

function mapDetail(groupID, entryClass) {
  var d=document.getElementById(groupID).getElementsByTagName("p");
  for(var i=0; i<d.length; i++) 
    if(d[i].getAttribute("class")==entryClass) insertURI(d[i]);
}

function insertURI(entry) {
  var l=entry.getElementsByTagName("a");
  if(l.length != 0) requestASX(l[0].getAttribute("href"), entry);
}

function parseXML_mms(text) {
  var parser=new DOMParser();
  var dom=parser.parseFromString(text,"application/xml");
  return dom.getElementsByTagName("Ref")[1].getAttribute("HREF");
}

function parseXML_rtmp(text) {
  var parser=new DOMParser();
  var dom=parser.parseFromString(text,"application/xml");
  return dom.getElementsByTagName("Url")[0].textContent;
}

function requestASX(src, place) {
  var m=src.match(/\/player\/(\d+)\/(v\d+)\/(v\d+)/);
    var vid=m[1]+':'+m[2]+':'+m[3];
  var param, t;

  if(document.getElementById("GyaoPlayer")) {
    param="device_type=1100&delivery_type=3&service_id=gy&"
      + "html_location="+src
      +"&appid=ff_rbJCxg67.bRk_lk7CbWFjhorGVKjvFsRgiLDHW4PE.vN6zxDW6KyRr1Zw3rI-";
    t="https://gw.gyao.yahooapis.jp/v1/rtmp/"+vid+"/multiVideo?"+param;
  } else {
    param="cp_id="+m[1]+"&program_id="+m[2]+"&video_id="+m[3]+"&band=0";
    var tok=MD5_hexhash('gyao'+vid+Math.floor(timestamp()/300)*300);
    t="http://player.gyao.yahoo.co.jp/wmp/makeAsxSl.php?"+param+'&tok='+tok;
  }

    var connection = chrome.extension.connect();

    if (null == place) place = document.getElementById("main_cnt").firstChild;

    connection.onMessage.addListener(
      document.getElementById("GyaoPlayer")
        ?
      function(msg){
        msg = parseXML_rtmp(msg);
        var mt = msg.match(/\/([^\/]+\/[^\/]+)\/,(.+)$/);
        var command = 'rtmpdump --swfVfy "'
              +document.getElementById('GyaoPlayer').data+'" '
              +'-r "'+msg+'" '
              +'-o '
              +'"'+document.getElementsByClassName('devTitle')[0].textContent+'.f4v" '
              +'-a "'+mt[1]+'" '
              +'-y "'+mt[2]+'" '
              +'-p "'+document.location.href+'"';
        makeResponseHandler(place, msg, command);
      }
    : function(msg){
      var url = parseXML_mms(msg);
      makeResponseHandler(place, url, url);
      });

    connection.postMessage(
      { href:t,
        referer:document.location.href,
        vid: vid
      });
}

requestASX(document.location.href, null);
