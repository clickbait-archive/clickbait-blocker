/**
 * Running our scripts in a container manner so that we do not mess with
 * variables on the page too much.
 * @param  {object} chrome  The Chrome object we will use to interact with the
 *                          page.
 */
(function() {
  // Setup our variable that will contain all data we care about.
  var ClickBaitBlocker = {
    whitelist: null,
    blacklist: null,
    configuration: null
  };

  /**
   * Function to call the logic once we have both settings from our Chrome
   * settings, and our XHR request that will have our stored settings.
   * @return {[type]} [description]
   */
  var checkTheSite = function() {
    // If both settings haven't returned, then just return false. We don't need
    // to do anything here.
    if (ClickBaitBlocker.whitelist == null || ClickBaitBlocker.configuration == null) {
      // We don't have both yet— return false and we will get back to it.
      return false;
    }

    // Our three checks. Is it on either of the blacklists? Is it on the
    // whitelist?
    var onBlacklist = ClickBaitBlocker.blacklist.includes(ClickBaitBlocker.currentHostname);
    var onWhitelist = ClickBaitBlocker.whitelist.includes(ClickBaitBlocker.currentHostname);
    var onBuiltinBlacklist = ClickBaitBlocker.configuration.blocked_sites.includes(ClickBaitBlocker.currentHostname);

    // If this site is on either black list, and not on the allowed whitelist—
    // let us get rid of it.
    if ((onBlacklist || onBuiltinBlacklist) && !onWhitelist) {
      // Well, we don't want our eyeballs to care about this site. Let's break
      // it. Break it into small pieces— well... just hide it. But breaking
      // sounds more cool.
      breakTheSite();
    }
  }

  /**
   * Will take a modal, and cover our site with it.
   */
  var breakTheSite = function() {

  }

  // What is the hostname we are currently on?
  ClickBaitBlocker.currentHostname = document.location.hostname;

  // Grab the settings that we have stored in the json file locally.
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      // We have the configuration, let's save it locally.
      ClickBaitBlocker.configuration = JSON.parse(xhr.responseText);

      // Kick off the checks of this site vs the blocklists.
      checkTheSite();
    }
  };
  // Make the XHR request, getting the local URL via Chrome's extension code.
  xhr.open("GET", chrome.extension.getURL('/configuration/configuration.json'), true);
  xhr.send();

  // Grab a user's personal settings on what to block and what to always show.
  chrome.storage.sync.get({
    whitelist: [],
    blacklist: []
  }, function(items) {
    ClickBaitBlocker.whitelist = items.whitelist;
    ClickBaitBlocker.blacklist = items.blacklist;
    checkTheSite();
  });

})();
