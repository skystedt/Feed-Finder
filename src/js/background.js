(function () {
    "use strict";
    
    chrome.runtime.onInstalled.addListener(async (details) => {
        await fetchDataIntoStorage('known_feeds');
        await fetchDataIntoStorage('subscription_urls');
        await selectFirstSubscriptionUrl();
    });
    
    chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
        // must return true to signal async response, https://developer.chrome.com/apps/runtime#event-onMessage
        // can not make async because then return true is called to late
        // always calls sendResponse even with undefined response so caller is notified
        switch (message.method) {
            case 'get_feeds': {
                getFeeds(message.data)
                .then(sendResponse);
                break;
            }
            case 'set_feeds': {
                setFeeds(sender.tab.id, message.data)
                .then(sendResponse);
                break;
            }
            case 'activate': {
                activatePageAction(sender.tab.id)
                .then(sendResponse);
                break;
            }
            case 'subscribe': {
                subscribeToFeed(message.data)
                .then(sendResponse);
                break;
            }
            case 'get_known': {
                getKnownFeeds()
                .then(sendResponse);
                break;
            }
        }
        return true;
    });
    
    chrome.tabs.onRemoved.addListener(async (tabId) => {
        await removeFeeds(tabId);
    });
    
    async function fetchDataIntoStorage(name)
    {
        const data = await fetchData(name);
        await storageSet(name, data);
    }
    
    async function selectFirstSubscriptionUrl(name)
    {
        const urls = await storageGet('subscription_urls');
        const url = urls[0];
        await storageSet('selected_subscription_url', url);
    }
    
    async function setFeeds(id, feeds)
    {
        await storageSet('feed-'+id, feeds);
    }
    
    async function getFeeds(id)
    {
        return await storageGet('feed-'+id);
    }
    
    async function removeFeeds(id)
    {
        await storageRemove('feed-'+id);
    }
    
    async function activatePageAction(tabId) {
        await pageActionShow(tabId);
    }
    
    async function getKnownFeeds() {
        return await storageGet('known_feeds');
    }
    
    async function subscribeToFeed(feed)
    {
        const subscription = await storageGet('selected_subscription_url');
        if (subscription.encoding === undefined || subscription.encoding) {
            feed = encodeURIComponent(feed);
        }
        const url = feed.replace(/(.*)/, subscription.url);
        await createTab(url);
    }
})();