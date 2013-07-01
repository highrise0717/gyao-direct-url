
chrome.extension.onConnect.addListener(
  function(port) {
    port.onMessage.addListener(
      function(msg) {
        var req=new XMLHttpRequest();
        req.open('POST', msg.href, true);
        req.onreadystatechange=function() {
          if (req.readyState==1)
            req.setRequestHeader('Referer', msg.referer);
          else if (req.readyState==4) {
            port.postMessage(parseXML(req.responseText));
          }
        };
        req.setRequestHeader('Content-type',
                             'application/x-www-form-urlencoded');
        req.send();
      });
  });

function parseXML(text) {
  var parser=new DOMParser();
  var dom=parser.parseFromString(text,"application/xml");
  return dom.getElementsByTagName("Url")[0].textContent;
}
