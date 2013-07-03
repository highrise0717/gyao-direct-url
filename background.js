
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
            port.postMessage(req.responseText);
          }
        };
        req.setRequestHeader('Content-type',
                             'application/x-www-form-urlencoded');
        req.send();
      });
  });
