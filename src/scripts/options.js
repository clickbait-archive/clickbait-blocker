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


}

// Kick off our settings page by loading what we have.
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
