'use strict';

// check if there is a <xml> tag containing a feed
// content types: text/xml
function xmlDocumentContainsFeed(doc) {
	if (doc instanceof XMLDocument) {
        
        let feeds = doc.querySelectorAll('rss, feed, rdf');
        if (feeds)
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
        
        let pres = doc.querySelectorAll('body>pre');
        for (let pre of pres) {
            
            let parser  = new DOMParser();
            let xmlDoc = parser.parseFromString(pre.textContent, 'text/xml');
            
            if (xmlDocumentContainsFeed(xmlDoc)) {
                return true;
            }
        }
    }

    return false;
}

// check if there is a <link> tag that points to a feed
function linkedFeeds(doc) {
    let feeds = [];
    let links = doc.querySelectorAll('link[type*=rss], link[type*=atom], link[type*=rdf]');
    for (let link of links) {
        feeds.push({ 'href': link.href, 'title': link.title });
    }
    return feeds;
}

// check if url has a known feed
function knownFeeds(url) {
    
    let feeds = [];
    
    //https://www.youtube.com/watch?v=LIQkuF_I5Xo&list=PLPQwGV1aLnTsHvzevl9BAUlfsfwFfU7aP
    //https://www.youtube.com/feeds/videos.xml?playlist_id=PLPQwGV1aLnTsHvzevl9BAUlfsfwFfU7aP
    
    //https://www.youtube.com/user/aantonop
    //https://www.youtube.com/feeds/videos.xml?user=
    
    //https://www.youtube.com/channel/UCT0hbLDa-unWsnZ6Rjzkfug
    //https://www.youtube.com/feeds/videos.xml?channel_id=UCUT8RoNBTJvwW1iErP6-b-A
    
    return feeds;
}