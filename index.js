const path = require('path');
const fs = require('fs');
const request = require('request');
const queryString = require('query-string');
const Parser = require('rss-parser');
const url = require('url');

const settings = {
  feed_url: 'https://feeds.simplecast.com/xxxxxx',
  token: 'TOKEN iDnj0vz6vj TOKEN fiYDsb7J17 TOKEN',
  log_errors: null // set to true to see errors in console
}

// console out errors
async function logError(errors) {
  if(settings.log_errors) {
    console.log("\n");
    console.log("#################### ERROR ####################");
    console.log("\n");
    console.log(errors);
    console.log("\n");
  }
}

// post update
async function updateItem(item) {
  return new Promise(resolve => {

    if(item.itunes.episode) {

      const number = String(item.itunes.episode).padStart(3,0),
            guid = url.parse(item.enclosure.url).pathname.split('/')[4];

      const request_data = {
        url: 'https://api.simplecast.com/episodes/' + guid,
        headers: {
          'accept': '*/*',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9',
          'authorization': 'Bearer ' + settings.token,
          'content-type': 'application/json;charset=UTF-8',
          'origin': 'https://dashboard.simplecast.com',
          'referer': 'https://dashboard.simplecast.com/episodes/' + guid +'/edit',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36'
        },
        body: JSON.stringify(
          {
            "id": guid,
            "custom_url": "https://epicenter.tv/" + number,
            "slug": number,
            "status": "published"
          } 
        )
      }

      console.dir(item.link);

      request.post(request_data, function(err, res) {
        console.dir(item.title);
        console.dir(request_data.body);
        console.log('');
        console.log('');
        const response = res.body;
        const errors = response.errors;
        if(errors) {
          logError(errors);
        }
        resolve(response);
      });
    }
  });
}

let rss = new Parser();

(async () => {
  // read rss feed
  const feed = await rss.parseURL(settings.feed_url);
  feed.items.forEach(async (item) => {
    await updateItem(item)
  });
})();
