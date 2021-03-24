/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const initialTweets = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1616434810490
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd"
    },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1616521210490
  }
];

const createTweetElement = tweet => {
  
  // create base article element -> this is what we will return
  const $tweetArticle = $('<article>');
  
  // setup tweet header elements
  const $tweetHeader = $('<header>'),
    $tweetHeaderDiv = $('<div>'),
    $tweetAvatar = $('<img>'),
    $tweetName = $('<h3>'),
    $tweetHandle = $('<h3>');
  $tweetAvatar.addClass('profile-pic');
  $tweetAvatar.attr('src', tweet.user.avatars);
  $tweetName.append(tweet.user.name);
  $tweetHandle.append(tweet.user.handle);

  // setup tweet content element
  const $tweetContent = $('<p>');
  $tweetContent.addClass('tweet-text');
  $tweetContent.append(tweet.content.text);

  // setup tweet footer elements
  const $tweetFooter = $('<footer>'),
    $tweetFooterDate = $('<span>');
  const tweetDaysSinceCreated = Math.round((new Date() - new Date(tweet.created_at)) / (1000 * 60 * 60 * 24));
  const tweetDateContent = tweetDaysSinceCreated > 1 ? `${tweetDaysSinceCreated} days ago` : `${tweetDaysSinceCreated} day ago`;
  $tweetFooterDate.append(tweetDateContent);
  // shows exact tweet creation time on hover
  $tweetFooterDate.attr('title', new Date(tweet.created_at));

  const $tweetActionElements = $('<div>'),
    $tweetActionElement1 = $('<img>'),
    $tweetActionElement2 = $('<img>'),
    $tweetActionElement3 = $('<img>');
  $tweetActionElement1.attr('src', 'images/flag.png');
  $tweetActionElement1.attr('alt, flag');
  $tweetActionElement2.attr('src', 'images/retweet.png');
  $tweetActionElement2.attr('alt, retweet');
  $tweetActionElement3.attr('src', 'images/heart.png');
  $tweetActionElement3.attr('alt, heart');

  // put together the final article element
  $tweetArticle.append($tweetHeader);
  $tweetHeader.append($tweetHeaderDiv);
  $tweetHeaderDiv.append($tweetAvatar);
  $tweetHeaderDiv.append($tweetName);
  $tweetHeader.append($tweetHandle);
  $tweetArticle.append($tweetContent);
  $tweetArticle.append($tweetFooter);
  $tweetFooter.append($tweetFooterDate);
  $tweetFooter.append($tweetActionElements);
  $tweetActionElements.append($tweetActionElement1);
  $tweetActionElements.append($tweetActionElement2);
  $tweetActionElements.append($tweetActionElement3);

  return $tweetArticle;
};

const renderTweets = tweets => {
  const tweetElements = [];
  for (const tweet of tweets) {
    tweetElements.push(createTweetElement(tweet));
  }
  $('.tweets').append(tweetElements);
};

$(document).ready(() => {
  renderTweets(initialTweets);
});
