// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */

function getCurrentTabUrl(callback) {
	// Query filter to be passed to chrome.tabs.query - see
	// https://developer.chrome.com/extensions/tabs#method-query
	var queryInfo = {
		active: true,
		currentWindow: true
	};

	chrome.tabs.query(queryInfo, (tabs) => {
		// chrome.tabs.query invokes the callback with a list of tabs that match the
		// query. When the popup is opened, there is certainly a window and at least
		// one tab, so we can safely assume that |tabs| is a non-empty array.
		// A window can only have one active tab at a time, so the array consists of
		// exactly one tab.
		let tab = tabs[0];
		// console.log(tab);

		// A tab is a plain object that provides information about the tab.
		// See https://developer.chrome.com/extensions/tabs#type-Tab
		let url = tab.url;

		// tab.url is only available if the "activeTab" permission is declared.
		// If you want to see the URL of other tabs (e.g. after removing active:true
		// from |queryInfo|), then the "tabs" permission is required to see their
		// "url" properties.
		console.assert(typeof url == 'string', 'tab.url should be a string');

		callback(url);
	});

	// Most methods of the Chrome extension APIs are asynchronous. This means that
	// you CANNOT do something like this:
	//
	// var url;
	// chrome.tabs.query(queryInfo, (tabs) => {
	//   url = tabs[0].url;
	// });
	// alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * Change the background color of the current page.
 *
 * @param {string} color The new background color.
 */
function changeBackgroundColor(color) {
	let script = 'document.body.style.backgroundColor="' + color + '";';
	// script += 'document.body.style.color="magenta";';
	// See https://developer.chrome.com/extensions/tabs#method-executeScript.
	// chrome.tabs.executeScript allows us to programmatically inject JavaScript
	// into a page. Since we omit the optional first argument "tabId", the script
	// is inserted into the active tab of the current window, which serves as the
	// default.
	chrome.tabs.executeScript({
		code: script
	});
}

let col_dropdown;
let font_dropdown;
let font_size_dropdown;
let font_size_multiplayer_dropdown;
let background_dropdown;
let dropdown;

function setup() {
	dropdown = select('#dropdown');
	dropdown.changed((col) => {
		// console.log('lol');
		console.log(dropdown.value());
		changeBackgroundColor(dropdown.value());
	});

	col_dropdown = select('#col_dropdown');
	col_dropdown.changed((col) => {
		// console.log('lol');
		console.log(col_dropdown.value());
		changeTxtColor(col_dropdown.value());
	});

	font_dropdown = select('#font_dropdown');
	font_dropdown.changed((font) => {
		// console.log('lol');
		console.log(font_dropdown.value());
		changeFont(font_dropdown.value());
	});

	font_size_dropdown = select('#font_size_dropdown');
	font_size_dropdown.changed((font) => {
		// console.log('lol');
		console.log(font_size_dropdown.value());
		changeFontSize(font_size_dropdown.value());
	});

	// TODO: PLZ FIX`
	// font_size_multiplayer_dropdown = select('#font_size_multiplayer_dropdown');
	// font_size_multiplayer_dropdown.changed((font) => {
	// 	// console.log('lol');
	// 	console.log(font_size_multiplayer_dropdown.value());
	// 	changeFontSize(font_size_multiplayer_dropdown.value());
	// });

	background_dropdown = select('#background_dropdown');
	background_dropdown.changed((font) => {
		// console.log('lol');
		console.log(background_dropdown.value());
		changeAllBackgroundColors(background_dropdown.value());
	});

	text_replacement = select('#text_replacement');
	text_replacement.changed((text) => {
		// console.log('lol');
		console.log(text_replacement.value());
		changeAllText(text_replacement.value());
	});
}

function getAllChildNodes() {
	let all_elts = document.getElementsByTagName('*');
	let child_elts = [];
	for (elt of all_elts) {
		if (elt.children.length == 0) {
			child_elts.push(elt)
		}
	}
	return child_elts;
}

function changeTxtColor(col) {
	script = 'all_elts = document.getElementsByTagName(\'*\');';

	script += "for (let i = 0; i < all_elts.length; i++) { try {all_elts[i].style.color \
		= \'" + col + "\';} catch (err) {} }";

	script += 'console.log(all_elts);';

	chrome.tabs.executeScript({
		code: script
	});
}

function changeAllBackgroundColors(col) {
	script = 'all_elts = document.getElementsByTagName(\'*\');';

	script += "for (let i = 0; i < all_elts.length; i++) { try {all_elts[i].style.backgroundColor \
		= \'" + col + "\';} catch (err) {} }";

	script += 'console.log(all_elts);';

	chrome.tabs.executeScript({
		code: script
	});
}

function changeFont(font) {
	script = 'all_elts = document.getElementsByTagName(\'*\');';

	script += "for (let i = 0; i < all_elts.length; i++) { try {all_elts[i].style['font-family']\
		= \'" + font + "\';} catch (err) {} }";

	script += 'console.log(all_elts);';

	chrome.tabs.executeScript({
		code: script
	});
}

function changeFont(font) {
	script = 'all_elts = document.getElementsByTagName(\'*\');';

	script += "for (let i = 0; i < all_elts.length; i++) { try {all_elts[i].style['font-family']\
		= \'" + font + "\';} catch (err) {} }";

	script += 'console.log(all_elts);';

	chrome.tabs.executeScript({
		code: script
	});
}

function changeFontSize(font) {
	script = 'all_elts = document.getElementsByTagName(\'*\');';

	script += "for (let i = 0; i < all_elts.length; i++) { try {all_elts[i].style['font-size']\
		= \'" + font + "\';} catch (err) {} }";

	script += 'console.log(all_elts);';

	console.log(script)

	chrome.tabs.executeScript({
		code: script
	});
}

function changeAllText(text) {
	script = String(getAllChildNodes);
	script += 'child_elts = getAllChildNodes();';
	console.log(getAllChildNodes());

	script += `for (let elt of child_elts) { \
		try {elt.innerHTML = '${text}';\
	} catch (err) {} }`

	script += 'console.log(child_elts);';

	console.log(script);

	chrome.tabs.executeScript({
		code: script
	});
}

// function changeTxtColor(col) {
// 	// let script = 'document.body.style.color="' + color + '";';
// 	// all_elts =  selectAll('p');
// 	// let script = 'all_elts = ' + JSON.stringify(all_elts) + ';';
// 	// let script = 'selectAll = ' + selectAll + ';';
// 	// script += 'all_elts = selectAll(\'*\');';
// 	script = 'all_elts = document.getElementsByTagName(\'*\');';

// 	// console.log(all_elts);

// 	script += "for (let i = 0; i < all_elts.length; i++) { try {all_elts[i].style.color \
// 		= \'" + col + "\';} catch (err) {} }";
// 	// for (let i = 0; i < all_elts.length, i++) {
// 	// }

// 	// script += 'console.log(\'test\');';
// 	script += 'console.log(all_elts);';

// 	chrome.tabs.executeScript({
// 		code: script
// 	}); 
// }

/**
 * Gets the saved background color for url.
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
function getSavedBackgroundColor(url, callback) {
	// See https://developer.chrome.com/apps/storage#type-StorageArea. We check
	// for chrome.runtime.lastError to ensure correctness even when the API call
	// fails.
	chrome.storage.sync.get(url, (items) => {
		callback(chrome.runtime.lastError ? null : items[url]);
	});
}

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
function saveBackgroundColor(url, color) {
	var items = {};
	items[url] = color;
	// See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
	// optional callback since we don't need to perform any action once the
	// background color is saved.
	chrome.storage.sync.set(items);
}

// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.
document.addEventListener('DOMContentLoaded', () => {
	getCurrentTabUrl((url) => {
		let dropdown = document.getElementById('dropdown');

		// Load the saved background color for this page and modify the dropdown
		// value, if needed.
		getSavedBackgroundColor(url, (savedColor) => {
			if (savedColor) {
				changeBackgroundColor(savedColor);
				dropdown.value = savedColor;
			}
		});

		// Ensure the background color is changed and saved when the dropdown
		// selection changes.
		dropdown.addEventListener('change', () => {
			changeBackgroundColor(dropdown.value);
			saveBackgroundColor(url, dropdown.value);
		});
	});
});