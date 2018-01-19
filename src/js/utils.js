"use strict";

function sendMessage(method, data) {
    return new Promise((resolve) => {
        const message = { 'method': method, 'data': data };
        chrome.extension.sendMessage(message, (result) => {
            resolve(result);
        });
    });
}

function getTabId() {
    return new Promise((resolve) => {
        chrome.tabs.getSelected((tab) => {
            resolve(tab.id);
        });
    });
}

function createTab(url) {
    return new Promise((resolve) => {
        chrome.tabs.create({ 'url': url }, (tab) => {
            resolve();
        });
    });
}

async function pageActionShow(id) {
    chrome.pageAction.show(id);
}

async function fetchData(name) {
    const relativUrl = '/data/' + name + '.json';
    const absoluteUrl = chrome.extension.getURL(relativUrl);
    const result = await fetch(absoluteUrl);
    return result.json();
}

function storageSet(key, value) {
    return new Promise((resolve) => {
        const item = {};
        item[key] = value;
        chrome.storage.local.set(item, () => {
            resolve();
        });
    });
}

function storageGet(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (items) => {
            resolve(items[key]);
        });
    });
}

function storageRemove(key) {
    return new Promise((resolve) => {
        chrome.storage.local.remove(key, () => {
            resolve();
        });
    });
}