
function timestamp() {
  var ts_path = '//comment()';
  var evaluater = document.evaluate(ts_path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  var item = evaluater.snapshotItem(evaluater.snapshotLength-1);
  var matchobj = item.textContent.match(/chunked (.+) JST(.+)$/);
  return (new Date(matchobj[1]+matchobj[2])).getTime()/1000;
}

function makeResponseHandler(place, href) {
  var p=document.createElement("div");
  var l=document.createElement("a");
  l.setAttribute("href", href);
  l.innerText=href;
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

function requestASX(src, place) {
  var m=src.match(/\/player\/(\d+)\/(v\d+)\/(v\d+)/);

  if(m) {
    var vid=m[1]+':'+m[2]+':'+m[3];
    var param=
      "cp_id="+m[1]+
      "&program_id="+m[2]+
      "&video_id="+m[3]+
      "&band=0";
    var t="http://player.gyao.yahoo.co.jp/wmp/makeAsxSl.php?"+param;
    var connection = chrome.extension.connect();

    if (null == place) place = document.getElementById("main_cnt").firstChild;

    connection.onMessage.addListener(
      function(msg){
        makeResponseHandler(place, msg);
      });

    connection.postMessage(
      { href:t,
        referer:document.location.href,
        vid: vid,
        timestamp: timestamp()
      });
  } else if(src.match(/\/p\/(\d+)\/(v\d+)/)) {
    mapDetail("dev_p_colist_l", "left2");
  } else if(src.match(/\/my\/pl\/list\//)) {
    mapDetail("leftcnt", "mov_title");
  }
}

requestASX(document.location.href, null);
