// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
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
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user);
  });
}

window.onload = function() {
  initApp();
};

window.channelName = "YouTube";
window.channelUrl = "https://www.youtube.com";

chrome.runtime.onMessage.addListener(receiver);

function receiver(request, sender, sendResponse){
    console.log(request);
    channelName = request.channelName;
    channelUrl = request.channelUrl;
}
