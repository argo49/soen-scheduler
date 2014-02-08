window.fbAsyncInit = function() {
    FB.init({
        appId      : '665040556873147',
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
    });

    // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
    // for any authentication related change, such as login, logout or session refresh. This means that
    // whenever someone who was previously logged out tries to log in again, the correct case below 
    // will be handled. 
    FB.Event.subscribe('auth.authResponseChange', function(response) {
        // Here we specify what we do with the response anytime this event occurs. 
        if (response.status === 'connected') { 
            // They have logged in to the app.
            testAPI();
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not into the app
            FB.login();
        } else {
            // In this case, the person is not logged into Facebook
            FB.login();
        }
    });
};

// Load the SDK asynchronously
(function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "http://connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));

// Here we run a very simple test of the Graph API after login is successful. 
// This testAPI() function is only called in those cases. 
function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      // Successful login! Send response object to server.
      $('.form').addClass("loading");
      $('.main').append($('<h4 class="center"/>').text("Thanks for logging in " + response.first_name + "! Redirecting you now..."));
      console.log('Good to see you, ' + response.name + '.');
      console.log(response);
    });
}