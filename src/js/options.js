require("../sass/options.scss");
require("./array_includes_polyfil");


var ClickBaitBlocker = {};


/**
 * Save options to Chrome's setttings.
 * @return {[type]} [description]
 */
function save_options() {

}

/**
 * Restores options saved within chrome.storage.
 * @return {[type]} [description]
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

function loadOptions() {
  ClickBaitBlocker.whitelist.forEach(function(value, index) {
    var element = document.createElement('p');
        element.innerHTML = value;


    document.getElementById('whitelist-settings').appendChild(element);
  });
}

function removeFromList(item, list) {
  var list = (typeof list !== 'undefined') ?  list : "whitelist";


}


// Kick off our settings page by loading what we have.
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
