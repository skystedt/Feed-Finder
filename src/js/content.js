(function () {
    "use strict";

    if (xmlDocumentContainsFeed(document)) {
        foundFeeds(location.href);
    } else {
        document.addEventListener('DOMContentLoaded', loaded);
    }
    
    async function loaded() {
        if (htmlDocumentContainsFeed(document)) {
            foundFeeds(location.href);
            return;
        }
        
        const known = await knownFeeds(location.href);
        if (known) {
            foundFeeds(known);
            return;
        }
        
        const linked = linkedFeeds(document);
        if (linked.length > 0) {
            foundFeeds(linked);
            return;
        }
    }
    
    async function foundFeeds(feeds) {
        await sendMessage('set_feeds', feeds)
        await sendMessage('activate');
    }
    
    // check if there is a <xml> tag containing a feed
    // content types: text/xml, application/xml
    function xmlDocumentContainsFeed(doc) {
        if (doc instanceof XMLDocument) {
            // rss = RSS 2.0
            // feed = atom
            // rdf = RSS 1.0
            const feeds = doc.querySelectorAll('rss,feed,rdf');
            if (feeds.length > 0)
            {
                return true;
            }
        }
        return false;
    }
    
    // check if there is a <pre> tag containing xml
    // happens when document is rendered as text/plain
    // content types: application/rss+xml, application/atom+xml
    function htmlDocumentContainsFeed(doc) {
        if (doc instanceof HTMLDocument) {
            const pres = doc.querySelectorAll('body>pre');
            for (let pre of pres) {
                const parser  = new DOMParser();
                const xmlDoc = parser.parseFromString(pre.textContent, 'text/xml');
                if (xmlDocumentContainsFeed(xmlDoc)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    // check if url has a known feed
    async function knownFeeds(url) {
        const feeds = await sendMessage('get_known');
        for (let feed of feeds) {
            const re = new RegExp(feed.url);
            if (re.test(url)) {
                const match = url.replace(re, feed.replace);
                return match;
            }
        }
        return false;
    }
    
    // check if there is a <link> tag that points to a feed
    function linkedFeeds(doc) {
        const feeds = [];
        const links = doc.querySelectorAll('link[rel="alternate"][type="application/rss+xml"],link[rel="alternate"][type="application/atom+xml"]');
        for (let link of links) {
            const title = link.title || document.title;
            feeds.push({ 'href': link.href, 'title': title });
        }
        return feeds;
    }
})();