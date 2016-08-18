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
    configuration: null,
    baseId: 'clickbaitblocker__'
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
    ClickBaitBlocker.checks = {
      onBlacklist: ClickBaitBlocker.blacklist.includes(ClickBaitBlocker.currentHostname),
      onWhitelist: ClickBaitBlocker.whitelist.includes(ClickBaitBlocker.currentHostname),
      onBuiltinBlacklist: ClickBaitBlocker.configuration.blocked_sites.includes(ClickBaitBlocker.currentHostname)
    };

    // If this site is on either black list, and not on the allowed whitelist—
    // let us get rid of it.
    if ((ClickBaitBlocker.checks.onBlacklist || ClickBaitBlocker.checks.onBuiltinBlacklist) && !ClickBaitBlocker.checks.onWhitelist) {
      // Well, we don't want our eyeballs to care about this site. Let's break
      // it. Break it into small pieces— well... just hide it. But breaking
      // sounds more cool.
      breakTheSite();
    }
  }

  /**
   * Ignore the block. Just remove the cover div.
   */
  var ignoreTheBlock = function() {
    var cover = document.findElementById(ClickBaitBlocker.baseId + 'cover');
  }

  /**
   * Will take a modal, and cover our site with it.
   */
  var breakTheSite = function() {
    var buttonClass = ClickBaitBlocker.baseId + 'buttons';


    var coverDiv = document.createElement('div');
        coverDiv.id = ClickBaitBlocker.baseId + 'cover';

    var innerDiv = document.createElement('div');
        innerDiv.id = ClickBaitBlocker.baseId + 'inner';

    var titleHeader = document.createElement('h2');
        titleHeader.id = ClickBaitBlocker.baseId + 'title';
        titleHeader.innerHTML = 'This site is on the Click Bait Blocker list.'

    // Reason if we have this site blocked.
    var reason = 'This site is on our community-based block list. It has been determined that this site is mostly clickbait. If you would like to unblock this site, and be able to access it— you may add it to your personal whitelist or ignore this warning.';
    var buttonAction = 'Add to whitelist';
    var buttonValue = 'whitelist';

    // If this was on our personal blacklist, the reason is very different.
    if (ClickBaitBlocker.checks.onBlacklist) {
      reason = 'This site has been added to your personal block list. You can remove it from your personal block list, or ignore this warning.';
      buttonAction = 'Remove from blacklist';
      buttonValue = 'blacklist';
    }

    var whyBlocked = document.createElement('p');
        whyBlocked.id = ClickBaitBlocker.baseId + 'why-blocked';
        whyBlocked.innerHTML = reason;

    var ignoreBlock = document.createElement('button');
        ignoreBlock.id = ClickBaitBlocker.baseId + 'ignore';
        ignoreBlock.innerHTML = 'Ignore';
        ignoreBlock.value = 'ignore';
        ignoreBlock.class = buttonClass;

    var actionBlock = document.createElement('button');
        actionBlock.id = ClickBaitBlocker.baseId + 'action';
        actionBlock.innerHTML = buttonAction;
        actionBlock.value = buttonValue;
        actionBlock.class = buttonClass;


    innerDiv.appendChild(titleHeader);
    innerDiv.appendChild(whyBlocked);
    innerDiv.appendChild(ignoreBlock);
    innerDiv.appendChild(actionBlock);
    coverDiv.appendChild(innerDiv);
    document.getElementsByTagName('body')[0].appendChild(coverDiv);
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
  xhr.open('GET', chrome.extension.getURL('/configuration/configuration.json'), true);
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
