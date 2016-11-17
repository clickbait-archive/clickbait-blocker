require("../sass/options.scss");
require("./array_includes_polyfil");


var ClickBaitBlocker = {};


/**
 * Save options to Chrome's setttings.
 */
function save_options() {
  var blacklist = [];
  var whitelist = [];


  var blacklistNodes = document.getElementById("blacklist-settings");

  blacklistNodes.childNodes.forEach(function(node) {
    blacklist.push(node.childNodes[1].innerHTML);
  });


  var whitelistNodes = document.getElementById("whitelist-settings");

  whitelistNodes.childNodes.forEach(function(node) {
    whitelist.push(node.childNodes[1].innerHTML);
  });

  chrome.storage.sync.set({
    blacklist: blacklist,
    whitelist: whitelist
  });
}

/**
 * Restores options saved within chrome.storage.
 */
function restore_options() {
  // Grab a user's personal settings on what to block and what to always show.
  chrome.storage.sync.get({
    whitelist: [],
    blacklist: []
  }, function(items) {
    ClickBaitBlocker.whitelist = items.whitelist;
    ClickBaitBlocker.blacklist = items.blacklist;
    loadOptions();
  });
}

/**
 * Once the options are found by Chrome, we add them in.
 */
function loadOptions() {
  ClickBaitBlocker.whitelist.forEach(function(value, index) {

    var element = siteDOMElement(value, "whitelist");


    document.getElementById('whitelist-settings').appendChild(element);
  });


  ClickBaitBlocker.blacklist.forEach(function(value, index) {

    var element = siteDOMElement(value, "blacklist");


    document.getElementById('blacklist-settings').appendChild(element);
  });
}

/**
 * Creates the element to be added to our DOM.
 * @param  {String} siteName The name of the site to be added.
 * @param  {String} list     Should be "whitelist" or "blacklist".
 * @return {Node}            DOM Element to be added.
 */
function siteDOMElement(siteName, list) {
  var element = document.createElement('div');
      element.className = "options__site";

  var remove = document.createElement('div');
      remove.className = "options__site-remove " + list;
      remove.onclick = removeFromList;
      remove.innerHTML = "X";
      element.appendChild(remove);

  var site = document.createElement('div');
      site.className = "options__site-name";
      site.innerHTML = siteName;
      element.appendChild(site);

  return element;
}

/**
 * Remove the site from our list. Super simple, doesn't do anything until save.
 */
function removeFromList() {
  this.parentElement.remove();
}

/**
 * Adds a new element to our list.
 */
function addToList() {
  var listName = this.id.replace("-addition__button", "");

  var siteName = document.getElementById(listName + "-addition__text").value;
  if (validateSiteName(siteName)) {
    siteName = siteName.toLowerCase();

    var element = siteDOMElement(siteName, listName);
    document.getElementById(listName + '-settings').appendChild(element);
    document.getElementById(listName + "-addition__text").value = "";
  }
}

/**
 * Validates the name of the site.
 * @param  {String} siteName The site we are adding.
 * @return {Boolean}         Whether or not it is valid.
 */
function validateSiteName(siteName) {
  return (siteName !== "")
}


// Kick off our settings page by loading what we have.
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('blacklist-addition__button').addEventListener('click', addToList);
document.getElementById('whitelist-addition__button').addEventListener('click', addToList);
