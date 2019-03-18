const path = require('path');
const fs = require('fs');
const request = require('request');
const queryString = require('query-string');
const Parser = require('rss-parser');
const url = require('url');

const settings = {
  feed_url: 'https://feeds.simplecast.com/tAlbpTQY',
  token: '_aPls6w5n6mbIJWfsPdzxzk2XV85ECVC9MuVHVDCTnPmcWED34jDwCS2he2wBYZCrKuZiv8TKW0ifze-HuQI4RpznH-VXILDiKEjakHJKqDuWIg1ufDAHs9MXM4JyNO_Sgz12aqqHM2giKnMM7QFCDcudZQzVZqhspXSP9td5PKlHUjfWxDrQohzHOabhz8IYhRF376yuZ9avYRg0KY8UxZKp6HNH3jiNKq9VS_Lqkq-O4Rc9ZaJmOekFRgE2dTyk8Qx8ktFOGFC15lzGgTTsFMh1VEndjfqAdpK2dSYJoixZ1IgVTc',
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

    const number = item.itunes.episode,
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
    request.post(request_data, function(err, res) {
      // console.log("###### updateItem ########################################");
      console.log(number + " --- " + guid);
      console.log(res)
      // const response = JSON.parse(res.body);
      // const errors = response.errors;
      // if(errors) {
      //   logError(errors);
      // }
      // console.log(response)      
      // resolve(response);
    });
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


// (async () => {
//   // get token from Ghost Token API
//   auth_token = await getAuthToken(auth.username, auth.password, auth.client_id, auth.client_secret);
//   // read instagram export data file
//   const instagram_objects = await readDataFile(settings.instagram_data_file);
//   instagram_objects.forEach(async (instagram_object) => {
//     // push images to server
//     const image = await postImage(instagram_object);
//     // create blog posts
//     await postPost(image, instagram_object)
//   });
// })();

