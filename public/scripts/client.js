// Client-side JS

$(document).ready(function() {
    
  const renderTweets = function(tweets) {
    // loops through tweets
    for(const tweet of tweets) {
      // calls createTweetElement for each tweet
      const $tweet = createTweetElement(tweet);
      // takes return value and appends it to the tweets container
      $('#tweets-container').prepend($tweet);
    }
  }

  const createTweetElement = function(tweet) {
    const escape =  function(str) {
      let div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    let $tweet =  $(
    `<article class="tweet"> 
      <header>
        <div class="user">
          <span>
            <img src="${tweet.user.avatars}" class="tweet-avatar"></img>
            ${tweet.user.name}
          </span>
        </div>
        <span class="handle">${tweet.user.handle}</span>
      </header>
      <div class="tweeter">${escape(tweet.content.text)}</div>
      <footer>
        <span>${dateOfTweet(tweet.created_at)}</span>
        <icons>
          <i class="fas fa-flag fa-xs"></i>
          <i class="fas fa-retweet fa-xs"></i>
          <i class="fas fa-heart fa-xs"></i>
        </icons>
      </footer>
    </article>`);
    return $tweet;
  }

  $("#new-tweet").on('submit', function (event) {
    // Prevent the default form sumission process
    event.preventDefault();
    // Serialize() turns form data into query string because our server is configured to recieve that data format
    const serializeData = $(this).serialize();
    // $.val() is Jquery and returns the text value with the spaces
    const textLength = $("#tweet-text").val().length;
    if (!textLength) {
      //inserts custom message in HTML
      $("#msg").text("Your tweet must contain a message");
      //coding to make the error message appear on page
      $("div#error").slideDown();
      return;
    } 
    if (textLength > 140) {
      $("#msg").text("Your tweet is longer than 140 characters");
      $("div#error").slideDown();
      return;
    }

    $.ajax({ 
      url:"/tweets", 
      data: serializeData, 
      method: "POST",
    }).then(() => loadTweets())
    $(".tweet-box").trigger("reset"); //clear the message from the box after submit box is hit
    $("#counter").text('140'); // resets counter to 140
    $("div#error").slideUp(); // hides error message when problem is corrected, after submit button hit
    $("#tweet-text").focus(); // activates cursor in text box automatically
    });

    const loadTweets = function() {
      $.ajax({
        url: "/tweets", 
        method: 'GET',
        success: "this get request was a success"
      }).then((tweets) => renderTweets(tweets))
    }
    loadTweets();
  });

  const dateOfTweet = function(timestamp) {
    const howLongAgoMilliseconds = Date.now() - timestamp;
    const millsecondsPerMin = 1000*60;
    const millsecondsPerHour = 1000*60*60;
    const millsecondsPerDay = 1000*60*60*24;
    if (howLongAgoMilliseconds > millsecondsPerDay) {
      const howLongAgoDays = Math.ceil(howLongAgoMilliseconds / millsecondsPerDay);
      return `${howLongAgoDays} days ago`;
    }
    if (howLongAgoMilliseconds > millsecondsPerHour) {
      const howLongAgoHours = Math.ceil(howLongAgoMilliseconds / millsecondsPerHour);
      return `${howLongAgoHours} hours ago`;
    }
    if (howLongAgoMilliseconds > millsecondsPerMin) {
      const howLongAgoMins = Math.ceil(howLongAgoMilliseconds / millsecondsPerMin);
      return `${howLongAgoMins} minutes ago`
    }
    return "just now"
  }