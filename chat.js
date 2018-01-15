// Initialize Firebase
var config = {
    apiKey: "AIzaSyDVJsDtv_6en_j9ci5SI4l6GaEGyOlo31A",
    authDomain: "funchat-191006.firebaseapp.com",
    databaseURL: "https://funchat-191006.firebaseio.com",
    projectId: "funchat-191006",
    storageBucket: "funchat-191006.appspot.com",
    messagingSenderId: "506630715952"
};
firebase.initializeApp(config);

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
function initApp() {
    // Get a reference to the Firebase Realtime Database
    var chatRef = firebase.database().ref(),
        target = document.getElementById("firechat-wrapper"),
        chat = new FirechatUI(chatRef, target);


    let bgpage = chrome.extension.getBackgroundPage();
    var channelName = bgpage.channelName;
    console.log(channelName);

    var channelId = "-L2sYlmqb6gQpGxGIHSW"

    // Listen for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // [START_EXCLUDE]
            document.getElementById('quickstart-button').textContent = 'Sign out';
            // [END_EXCLUDE]
            chat.setUser(uid, displayName);
            $('#user-name').text(displayName);
            $('#user-info').show();
            setTimeout(function() {
                chat._chat.enterRoom(channelId)
            }, 500);

        } else {
            // Let's try to get a Google auth token programmatically.
            // [START_EXCLUDE]
            document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
            //document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            //document.getElementById('quickstart-account-details').textContent = 'null';
            // [END_EXCLUDE]
            $('#user-info').hide();
            chat._chat.enterRoom(channelId)

        }
        document.getElementById('quickstart-button').disabled = false;
    });
    // [END authstatelistener]

    document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
    // Request an OAuth token from the Chrome Identity API.
    chrome.identity.getAuthToken({
        interactive: !!interactive
    }, function(token) {
        if (chrome.runtime.lastError && !interactive) {
            console.log('It was not possible to get a token programmatically.');
        } else if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else if (token) {
            // Authorize Firebase with the OAuth Access Token.
            var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
            firebase.auth().signInWithCredential(credential).catch(function(error) {
                // The OAuth token might have been invalidated. Lets' remove it from cache.
                if (error.code === 'auth/invalid-credential') {
                    chrome.identity.removeCachedAuthToken({
                        token: token
                    }, function() {
                        startAuth(interactive);
                    });
                }
            });
        } else {
            console.error('The OAuth Token was null');
        }
    });
}

/**
 * Starts the sign-in process.
 */
function startSignIn() {
    document.getElementById('quickstart-button').disabled = true;
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    } else {
        startAuth(true);
    }
}

window.onload = function() {
    initApp();
};
