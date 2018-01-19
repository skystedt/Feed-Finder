(function () {
    "use strict";
    
    document.addEventListener('DOMContentLoaded', loaded);
    
    async function loaded() {
        const tabId = await getTabId();
        const feeds = await getFeeds(tabId);
        await handleFeeds(feeds);
    }
    
    function getFeeds(tabId) {
        return sendMessage('get_feeds', tabId)
    }
    
    function handleFeeds(feeds) {
        if (typeof feeds == 'string') {
            subscribeToFeed(feeds);
        } else if (feeds instanceof Array) {
            if (feeds.length == 1) {
                subscribeToFeed(feeds[0].href);
            } else {
                createFeedList(feeds);
            }
        }
    }
    
    function subscribeToFeed(feedUrl) {
        sendMessage('subscribe', feedUrl);
    }
    
    function createFeedList(feeds) {
        const list = document.createElement('ul');
        for (let feed of feeds) {
            const item = document.createElement('li');
            list.appendChild(item);
            
            const link = document.createElement('a');
            item.appendChild(link);
            const img = document.createElement('img');
            img.src = 'icons/feed-icon-16x16.png';
            link.appendChild(img);
            
            link.href = feed.href;
            link.addEventListener('click', (event) => {
                subscribeToFeed(event.currentTarget.href);
            });
            const text = document.createTextNode(feed.title);
            link.appendChild(text);
        }
        document.body.appendChild(list);
    }
})();