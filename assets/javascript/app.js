var firebaseConfig = {
    apiKey: "AIzaSyDhlMKfDvYomM0k2gZ_v4jAu_lQfwFQv-c",
    authDomain: "train-scheduler-afdb1.firebaseapp.com",
    databaseURL: "https://train-scheduler-afdb1.firebaseio.com",
    projectId: "train-scheduler-afdb1",
    storageBucket: "train-scheduler-afdb1.appspot.com",
    messagingSenderId: "117278996752",
    appId: "1:117278996752:web:e2fc6d7824e9df426e8d95"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  var trainData = firebase.database();

  $("#add-train").on("click", function(event) {
    event.preventDefault();
  
    var trainName = $("#nameInput").val().trim();
    var destination = $("#destInput").val().trim();
    var firstTrain = $("#timeInput").val().trim();
    var frequency = $("#freqInput").val().trim();
  
    var newTrain = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };
  
    trainData.ref().push(newTrain);

    alert("Train successfully added");
  
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
      
    $("#nameInput").val("");
    $("#destInput").val("");
    $("#timeInput").val("");
    $("#freqInput").val("");
  });

  trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
  
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;
  
    var timeArr = tFirstTrain.split(":");
    var trainTime = moment()
      .hours(timeArr[0])
      .minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;
  
    if (maxMoment === trainTime) {
      tArrival = trainTime.format("hh:mm A");
      tMinutes = trainTime.diff(moment(), "minutes");
    } else {
      var differenceTimes = moment().diff(trainTime, "minutes");
      var tRemainder = differenceTimes % tFrequency;
      tMinutes = tFrequency - tRemainder;
      tArrival = moment()
        .add(tMinutes, "m")
        .format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);
  
    $("#trainTable > tbody").append(
      $("<tr>").append(
        $("<td>").text(tName),
        $("<td>").text(tDestination),
        $("<td>").text(tFrequency),
        $("<td>").text(tArrival),
        $("<td>").text(tMinutes)
      )
    );
  });

