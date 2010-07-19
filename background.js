chrome.self.onConnect.addListener(
  function(port,name) {
    port.onMessage.addListener(
      function(info,con) {
        var req=new XMLHttpRequest();
        var ts=Math.floor((new Date).getTime()/1000);
        var tok=MD5_hexhash('gyao'+info.vid+Math.floor(ts/300)*300);
        req.open('POST', info.href+'&tok='+tok, true);
        req.onreadystatechange=function() {
          if (req.readyState==1)
            req.setRequestHeader('Referer', info.referer);
          else if (req.readyState==4)
            con.postMessage(parseXML(req.responseText));
        };
        req.setRequestHeader('Content-type',
                             'application/x-www-form-urlencoded');
        req.send();
      });
  });

function parseXML(text) {
  var parser=new DOMParser();
  var dom=parser.parseFromString(text,"application/xml");
  return dom.getElementsByTagName("Ref")[1].getAttribute("HREF");
}

