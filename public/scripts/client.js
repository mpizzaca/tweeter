/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const formatTweetDateString = createdAt => {
  const daysSinceCreation = Math.round((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
  if (daysSinceCreation === 0) return 'today';
  if (daysSinceCreation === 1) return `${daysSinceCreation} day ago`;
  return `${daysSinceCreation} days ago`;
}

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
  const formattedDate = formatTweetDateString(tweet.created_at)
  $tweetFooterDate.append(formattedDate);

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
  $tweetArticle.append($tweetHeader, $tweetContent, $tweetFooter);
  $tweetHeader.append($tweetHeaderDiv, $tweetHandle);
  $tweetHeaderDiv.append($tweetAvatar, $tweetName);
  $tweetFooter.append($tweetFooterDate, $tweetActionElements);
  $tweetActionElements.append($tweetActionElement1, $tweetActionElement2, $tweetActionElement3);

  return $tweetArticle;
};

const renderTweets = tweets => {
  const tweetElements = [];
  for (const tweet of tweets) {
    tweetElements.push(createTweetElement(tweet));
  }
  $('.tweets').append(tweetElements);
};

const handleTweetSubmit = function(event) {
  event.preventDefault();

  // validate tweet
  const tweetContent = $(this).children('#tweet-text').val();
  if (tweetContent.length === 0) {
    return alert('Tweet must have some content!');
  }

  if (tweetContent.length > 140) {
    return alert('Tweet cannot exceed 140 characters!');
  }

  const data = $(this).serialize();
  $.ajax({
    url: '/tweets',
    method: 'POST',
    data,
  })
  .then(res => console.log('Tweet saved successfully', res))
  .catch(err => console.log('Error saving tweet', err));
};

const loadTweets = () => {
  $.ajax({ url: '/tweets' })
  .then(renderTweets)
  .catch(console.log)
};

$(document).ready(() => {
  loadTweets();
  $('form').on('submit', handleTweetSubmit);
});
