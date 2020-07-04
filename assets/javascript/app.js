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
//var fStore = firebase.firestore();
var editMode = false;
var editID;

$("#add-train").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#nameInput").val().trim();
    var destination = $("#destInput").val().trim();
    var firstTrain = $("#timeInput").val().trim();
    var frequency = $("#freqInput").val().trim();
    
    if(editMode){

        var element = $("#" + editID);

        let trainNameElement = element.children("td:nth-child(1)");
        let trainDestinationElement = element.children("td:nth-child(2)");
        let trainDistanceElement = element.children("td:nth-child(3)");
        let trainFrequencyElement = element.children("td:nth-child(4)");

            // Update Row
            trainDestinationElement.text(destination);
            trainNameElement.text(trainName);
            trainDistanceElement.text(firstTrain);
            trainFrequencyElement.text(frequency);

            // DB update
           trainData.ref().child(editID).set(
               { name: trainName, 
                 destination: destination,
                 firstTrain: firstTrain,
                 frequency: frequency
                
                }

            );


            editMode = false;
            $(this).text("Submit");

            
    }else{
        var newTrain = {
            name: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        };
    
        var tId = trainData.ref().push(newTrain).key;
        console.log(tId);
    
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.firstTrain);
        console.log(newTrain.frequency);
    
        
    }

    $("#nameInput").val("");
    $("#destInput").val("");
    $("#timeInput").val("");
    $("#freqInput").val("");
});

trainData.ref().on("child_added", function (childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;
    var tId = childSnapshot.key;

    console.log(childSnapshot.key);


    var timeArr = tFirstTrain.split(":");
    var trainTime = moment()
        .hours(timeArr[0])
        .minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;

    var removeButton = $("<button>").html("<span class='fa fa-remove'></span>");
    var editButton = $("<button>").html("<span class='fa fa-pencil-square-o'></span>");

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
        $("<tr id='" + tId + "'>").append(
            $("<td>").text(tName),
            $("<td>").text(tDestination),
            $("<td>").text(tFrequency),
            $("<td>").text(tArrival),
            $("<td>").text(tMinutes),
            $("<td>").html(editButton),
            $("<td>").html(removeButton)
        )
    );
});

$("body").on("click", ".fa-remove", function () {
    var element = $(this).closest("tr");
    var id = element.attr("id");
    trainData.ref().child(id).remove();
    element.remove()
});


$("body").on("click", ".fa-pencil-square-o", function () {

let trainNameElement = $(this).parent().parent().siblings("td:nth-child(1)");
let trainDestinationElement = $(this).parent().parent().siblings("td:nth-child(2)");
let trainName = trainNameElement.text();
let trainDestination = trainDestinationElement.text();

// using jquery target the form's specific input and enter trainName, trainDestination
$("#nameInput").val(trainName);
console.log(trainName)

$("#destInput").val(trainDestination);
console.log(trainDestination)

$("#add-train").text("Save");
editMode = true;
var element = $(this).closest("tr");
editID= element.attr("id");

});





