/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const formatTweetDateString = createdAt => {
  const daysSinceCreation = Math.round((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
  let formattedString;
  if (daysSinceCreation === 0) {
    formattedString = 'today';
  } else if (daysSinceCreation === 1) {
    formattedString = `${daysSinceCreation} day ago`
  } else {
    formattedString = `${daysSinceCreation} days ago`;
  }
  return formattedString;
};

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
  $tweetName.text(tweet.user.name);
  $tweetHandle.text(tweet.user.handle);

  // setup tweet content element
  const $tweetContent = $('<p>');
  $tweetContent.addClass('tweet-text');
  $tweetContent.text(tweet.content.text);

  // setup tweet footer elements
  const $tweetFooter = $('<footer>'),
    $tweetFooterDate = $('<span>');
  const formattedDate = formatTweetDateString(tweet.created_at);
  $tweetFooterDate.text(formattedDate);

  // shows exact tweet creation time on hover
  $tweetFooterDate.attr('title', new Date(tweet.created_at));

  const $tweetActionElements = $('<div>'),
    $tweetActionFlag = $('<img>'),
    $tweetActionRetweet = $('<img>'),
    $tweetActionLike = $('<img>');
  $tweetActionFlag.attr('src', 'images/flag.png');
  $tweetActionFlag.attr('alt, flag');
  $tweetActionRetweet.attr('src', 'images/retweet.png');
  $tweetActionRetweet.attr('alt, retweet');
  $tweetActionLike.attr('src', 'images/heart.png');
  $tweetActionLike.attr('alt, heart');

  // put together the final article element
  $tweetArticle.append($tweetHeader, $tweetContent, $tweetFooter);
  $tweetHeader.append($tweetHeaderDiv, $tweetHandle);
  $tweetHeaderDiv.append($tweetAvatar, $tweetName);
  $tweetFooter.append($tweetFooterDate, $tweetActionElements);
  $tweetActionElements.append($tweetActionFlag, $tweetActionRetweet, $tweetActionLike);

  return $tweetArticle;
};

const renderTweets = tweets => {
  // clear any existing tweets
  $('.tweets').empty();
  // sort by most recent
  tweets.sort((a, b) => b.created_at - a.created_at);
  const tweetElements = [];
  for (const tweet of tweets) {
    tweetElements.push(createTweetElement(tweet));
  }
  $('.tweets').append(tweetElements);
};

const displayTweetError = msg => {
  const errorLabel = $('form > label.error');
  if (!msg) {
    return errorLabel.slideUp();
  }
  // queue the text change so it will wait until slideUp has finished (if a previous error was showing)
  errorLabel.queue(() => {
    errorLabel.text(msg);
    errorLabel.dequeue();
  });
  errorLabel.slideDown();
};

const handleTweetSubmit = function(event) {
  // stop default form page refresh
  event.preventDefault();
  // hide any previous errors
  displayTweetError(null);

  // validate tweet
  const tweetContent = $(this).children('#tweet-text').val();
  if (tweetContent.length === 0) {
    return displayTweetError('⚠️ Tweet cannot be empty!');
  }
  if (tweetContent.length > 140) {
    return displayTweetError('⚠️ Tweet cannot exceed 140 characters!');
  }
  
  // once validated, send data to server
  const data = $(this).serialize();
  $.ajax({
    url: '/tweets',
    method: 'POST',
    data,
  })
    .then(res => {
    // clear tweet text & reset character count
      $(this).children('#tweet-text').val(null);
      $(this).children('div').children('.counter').val(140);
      // reload tweets
      loadTweets();
    })
    .catch(err => console.log('Error saving tweet', err));
};

const loadTweets = () => {
  $.ajax({ url: '/tweets' })
    .then(renderTweets)
    .catch(console.log);
};

const toggleNewTweetBox = () => {
  if ($('form').is(':hidden')) {
    $('form').slideDown();
  } else {
    $('form').slideUp();
  }
};

const updateScrollToTopButton = () => {
  if ($(document).scrollTop() > 150) {
    $('#return-to-top').addClass('visible');
  } else {
    $('#return-to-top').removeClass('visible');
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

$(document).ready(() => {
  // hide our error message - will be shown if user enters malformed tweet
  $('form > label.error').hide();

  // hide new-tweet - will be shown when user clicks 'Write a new tweet' button in nav
  $('form').hide();

  // setup 'Write a new tweet' event handler
  $('#new-tweet-button').on('click', toggleNewTweetBox);

  // setup 'scroll to top' button
  $(window).on('scroll', updateScrollToTopButton);
  $('#return-to-top').on('click', scrollToTop);
  
  loadTweets();
  $('form').on('submit', handleTweetSubmit);
});
