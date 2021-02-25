/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


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
          <span>${tweet.created_at}</span>
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
      // console.log(serializeData);
      if (serializeData === "text=") {
        alert("You didn't add anything to your tweet");
      }
      if (serializeData.length > 145) {
        alert("You have exceded 140 characters");
      } else {
        $.ajax({ 
          url:"/tweets", 
          data: serializeData, 
          method: "POST",
          // success: function() {
          //   console.log("success");
          // }
        }).then(() => loadTweets())
        $("#tweet-text").trigger("reset");
        $("#counter").text(`140`);
        $("#tweet-text").focus();
      } 
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