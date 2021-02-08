// Server code

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyBogUrOkPpYTQqRWYgmPcCttsIuBiBN1zY",
    authDomain: "kindwords-c394e.firebaseapp.com",
    databaseURL: "https://kindwords-c394e-default-rtdb.firebaseio.com",
    projectId: "kindwords-c394e",
    storageBucket: "kindwords-c394e.appspot.com",
    messagingSenderId: "343957683016",
    appId: "1:343957683016:web:c67f812e534d9b8b86117d",
    measurementId: "G-48H1K6KYQ0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Get a reference to the database service
var database = firebase.database();

myStorage = window.localStorage; //yes im using localstorage because im lazy
var myKey;
var myReq;

var reqKeyArr = [];
var reqStrArr = [];

//Clear (delete) current request
function clearReq() 
{
    myKey = null;
    myReq = null;
    myStorage.clear();
    //TODO: clear all responses
}

//Initialize "need help" interface (on page load)
//A user's request is stored client-side on his/her computer
function initReq() 
{
    myKey = myStorage.keyy;
    myReq = myStorage.msg;
    //TODO: Disply myReq, with HTML
    if(myReq != null)
        document.getElementById("request").value = myReq;
    window.setInterval(function(){
    if (myKey != null && myReq != null) //ahh np im trying to figure out a way to make the page keep refreshing like live updates of responses
    {//Oh I'm sorry, got confused. What is the need for repeatedly calling getResponses? oh ok. We might need to clear the previous responses then yep we should probably do that
        getResponses(myKey);
    }},1000);
}

//Initialize "help others" interface (on page load)
function initHelp() 
{
    getPosts();
}


//Generate a "NEED HELP" message, along with a key that points to the message
//Parameters: 
//taele- textarea containing "NEED HELP" request message 
function writeNewPost(taele) 
{
    var str = taele.value;
    //alert(str);
    //TODO: implement this on the page
    var postData = {req: str,};
    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('posts').push().key;

    // Write the new post's data in the posts list 
    var updates = {};
    updates['/posts/' + newPostKey] = postData;
    firebase.database().ref().update(updates);
    
    //alert(newPostKey);
    
    localStorage.setItem('keyy', newPostKey); //THIS THING is unreadable by the site. works now
    localStorage.setItem('msg', str); //save the message
    //alert(myStorage.keyy);
}

//Retrieve ALL request posts from the database, DOES NOT retrieve response posts
function getPosts() 
{
    var numberOfRequests = 0; 
    var leadRef = firebase.database().ref('posts');
    leadRef.on("value", function(snapshot) 
    {
        snapshot.forEach(function(childSnapshot) 
        {
            var childData = childSnapshot.val();
            numberOfRequests++;
            var requestStr = childData.req;                                   // HOLDS "need help" messages
            var requestKey = Object.keys(snapshot.val())[numberOfRequests-1]; // HOLDS key to the above "need help message"
            console.log(requestKey);
            reqKeyArr.push(requestKey); //pushes "need help" key to request Key Array
            console.log(requestStr);
            reqStrArr.push(requestStr); //pushes "need help" string to request String Array (parallel Array with reqKeyArr)
        });
    });
}

//Generates a post randomly
//TODO: display this post in a card with HTML/JS magic
function getAPost()
{
  var randint = Math.floor(Math.random() * reqKeyArr.length);
  var mykey = reqKeyArr[randint];
  var myStr = reqStrArr[randint];
  console.log(mykey); 
  console.log(myStr);
  //alert(String(myKey)); //try this function maybe
  //alert(myStr);
  var key = mykey;
  var value = myStr;

  return {key, value};
}

//Gets a request string given its key (only applies to "i need help" posts)
function getReq(key)
{
  var ref = firebase.database().ref("posts");
  ref.on("value", function(snapshot) {
  var childData = snapshot.val();         
  console.log(childData[key].req);
  });
}

//Removes a request given its key
function removeReq(key)
{
  var ref = firebase.database().ref('posts/' + key);
  ref.remove()
  .then(function() {
  console.log("Remove succeeded.")
  })
  .catch(function(error) {
    console.log("Remove failed: " + error.message)
  });
}

//Generate a response token to a request, given its key
//Parameters: 
//key- request key, accessed using getPosts() -> requestKey, 
//taele- text box of response message 
function writeResponse(key, taele) 
{
    str = taele.value;
    var newres = firebase.database().ref('posts/' + key).push();
    newres.set(str);
    //TODO: implement this on the page
}
 
//Retrieves ALL response posts, given the key to the request post
//Parameters: 
//key- request key, accessed using getPosts() -> requestKey, 
function getResponses(key) 
{
    parentDiv = document.getElementById("replies");
    while(parentDiv.hasChildNodes()){
        parentDiv.firstChild.remove();
    }
    
    var leadRef = firebase.database().ref('posts/' + key);
    leadRef.on("value", function(snapshot) 
    {
        var ctr = 0;
        snapshot.forEach(function(childSnapshot) 
        {
            var responseStr = childSnapshot.val();        //Retrieves responses
            var responseKey = Object.keys(snapshot.val())[ctr]; //Retrieves the key to that^ response
            if (responseKey == "req") return;
            console.log(responseStr);
            //TODO: display each response using HTML on the page
            var childDiv = document.createElement("div");
            childDiv.setAttribute("class", "replies");
            var text = document.createElement("p");
            text.innerHTML = responseStr;
            childDiv.appendChild(text);
            parentDiv.appendChild(childDiv);
            ctr++;
        });
    });
}