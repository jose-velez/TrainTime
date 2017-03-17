//////////////////////////////////////////////////
//                                              //
//            Train Time                      ///
//                                             //
/////////////////////////////////////////////////

var trainName = "";
var destination = "";
var firstTrain = 0;
var frequency = 0;
var nextArrival = 0;
var lastTrain = 0;
var config = {
    apiKey: "AIzaSyDyYc0VWYFdm4FJfpBCAXvpeXKToT1C7Bc",
    authDomain: "train-time-412a0.firebaseapp.com",
    databaseURL: "https://train-time-412a0.firebaseio.com",
    storageBucket: "train-time-412a0.appspot.com",
    messagingSenderId: "380678336979"
};
firebase.initializeApp(config);
var database = firebase.database();
setInterval(clock, 1000);
function clock(){
  var currentTime = moment().format('LTS')
  $("#currentTime").html(currentTime);
}

// Function to create a train andpush it to firebase
$("#addTrain").on("click", function() {
    event.preventDefault();
    trainName = $("#trainInput").val().trim();
    destination = $("#destinationInput").val().trim();
    firstTrain = $("#firstTrain").val().trim();
    frequency = $("#frequency").val().trim();

    console.log(trainName);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);

    var newTrain = {
        train: trainName,
        dest: destination,
        firstTrain: firstTrain,
        freq: frequency,
    };
    console.log(newTrain);
    // Pushing the new train to firebase
    
    database.ref().push(newTrain);

    console.log(newTrain.train);
    console.log(newTrain.dest);
    console.log(newTrain.firstTrain);
    console.log(newTrain.freq);

});

// Create a function to create the table when a train is added to firebase

database.ref().on("child_added", function(childSnapshot, prevChildKey)
{
  console.log(childSnapshot.val());
  console.log(prevChildKey);

  trainName = childSnapshot.val().train;
  destination = childSnapshot.val().dest;
  firstTrain = childSnapshot.val().firstTrain;
  frequency = childSnapshot.val().freq;
  firstTrain = parseInt(firstTrain);
  frequency = parseInt(frequency);


  var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
  console.log(firstTrainConverted);
  var currentTime = moment();
  console.log("Current Time: " + moment(currentTime).format("hh:mm"));
  var diffTime = moment().diff(moment(firstTrainConverted), 'minutes');
  console.log("diference in time: " + diffTime);
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);
  var tminutesTillTrain = frequency - tRemainder;
  console.log("minutes till train: " + tminutesTillTrain);
  var nextTrain = moment().add(tminutesTillTrain, "minutes");
  console.log("arrival time: " + moment(nextTrain).format("hh:mm"));
  nextTrain = moment(nextTrain).format("hh:mm");

  $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + " min</td><td>" + nextTrain + "</td><td>" + tminutesTillTrain + "</td>")

});
