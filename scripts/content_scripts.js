/**
 * Running our scripts in a container manner so that we do not mess with
 * variables on the page too much.
 * @param  {object} chrome  The Chrome object we will use to interact with the
 *                          page.
 */
(function(chrome) {
  var ClickBaitBlocker = {};


  // What is the hostname we are currently on?
  ClickBaitBlocker.currentHostname = document.location.hostname;

  // Grab the settings that we have stored in the json file locally.
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      ClickBaitBlocker.configuration = JSON.parse(xhr.responseText);
    }
  };
  xhr.open("GET", chrome.extension.getURL('/configuration/configuration.json'), true);
  xhr.send();


  // Grab a user's personal settings on what to block and what to always show.
  chrome.storage.sync.get({
    whitelist: {},
    blacklist: {}
  }, function(items) {
    ClickBaitBlocker.whitelist = items.whitelist;
    ClickBaitBlocker.blacklist = items.blacklist;
  });

})(chrome);
