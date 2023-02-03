// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCIyGkqC74muufXv5RWJSCg5bZEDb8fUUU",
  authDomain: "new-tab-notes-a9d79.firebaseapp.com",
  databaseURL: "https://new-tab-notes-a9d79-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "new-tab-notes-a9d79",
  storageBucket: "new-tab-notes-a9d79.appspot.com",
  messagingSenderId: "928614823543",
  appId: "1:928614823543:web:beb22237dd62810f5d3872"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log(firebase);


chrome.runtime.onMessage.addListener((msg, sender, response) => {

  if(msg.command == 'fetchNotes'){
    firebase.database().ref('/notes').once('value').then(function(snapshot){
      response({type: "result", status: "success", data: snapshot.val(), request: msg});
    });

  }

  if(msg.command == 'deleteNote'){

    //..
    var noteId = msg.data.id;
    console.log(noteId);
    console.log("noteId"); 
    if(noteId != ''){
      try{

        var deleteNote = firebase.database().ref('/notes/'+noteId).remove();
        response({type:"result", status:"success", id: noteId, request: msg});

      }catch(e){
        //
        console.log("error", e);
        response({type:"result", status:"error", data: e, request: msg});
      }
    }

  }




  if(msg.command == 'postNote'){

    //..
    var title = msg.data.title;
    var body = msg.data.body;
    var icon = msg.data.icon;
    var noteId = msg.data.id;

    try{

      if(noteId != 'EMPTY-AUTOGEN--'){
        var newNote = firebase.database().ref('/notes/'+noteId).update({
          title: title,
          icon: icon,
          body: body
        });
        response({type: "result", status: "success", id:noteId, request: msg});
      }else{
        //..
        var newPostKey = firebase.database().ref().child('notes').push().key;
        var newNote = firebase.database().ref('/notes/'+newPostKey).set({
          title: title,
          icon:icon,
          body:body
        });
        console.log('new note id', newPostKey);
        response({type: "result", status: "success", id:newPostKey, request: msg});
      }

    }catch(e){
      //...

      console.log("error", e);
      response({type: "result", status: "error", data:e, request: msg});
    }

  }

  return true;


});
