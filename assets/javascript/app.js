$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyA5SPH69v_hpB1gRUQIKjKhi_VDqv_uH60",
        authDomain: "homework7-7116b.firebaseapp.com",
        databaseURL: "https://homework7-7116b.firebaseio.com",
        projectId: "homework7-7116b",
        storageBucket: "",
        messagingSenderId: "220774685459"
    };
    firebase.initializeApp(config);

    var dataRef = firebase.database();

    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = 0;
    var nextArrival = 0;
    var minutesAway = 0;

    //Grab the 4 inputs the user is going to make.

    dataRef.ref().once("value", function (snapshot) {
        console.log(snapshot.val());
    })
    dataRef.ref().on("child_added",function(snapshot){
        console.log(snapshot.val());
        addRow(snapshot.val())
    })
    function addRow(obj) {

        //create a row
        //create table data

        var row = $("<tr></tr>");
        var trainName = $("<td></td>").text(obj.trainName);
        var destination = $("<td></td>").text(obj.destination);
        var frequency = $("<td class='frequency'></td>").text(obj.frequency);
        var firstTrainTime = obj.firstTrainTime;
        console.log(obj.firstTrainTime,obj.frequency)

        var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1,"day");
        console.log(firstTrainTimeConverted)
        var diffTime = moment().diff(firstTrainTimeConverted, "minutes");
        console.log(diffTime)
        var tRemainder = diffTime % obj.frequency;
        console.log(tRemainder)
        var tMinutesTillTrain = obj.frequency - tRemainder;
        console.log(tMinutesTillTrain)
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        var tdMinutesTillTrain = $("<td class='minutes'></td>").text(tMinutesTillTrain);
        var tdNextTrain = $("<td class='nextArrival'></td>").text(nextTrain.format("HH:mm"));
        console.log(tdMinutesTillTrain)
        $("#tableBody").append(row);
        $(row).append(trainName);
        $(row).append(destination);
        $(row).append(frequency);
        $(row).append(tdNextTrain);
        $(row).append(tdMinutesTillTrain);

    }
    function update(){
        console.log("update")
        var frequencies = document.getElementsByClassName("frequency")
        var arrivals = document.getElementsByClassName("nextArrival")
        var minutes = document.getElementsByClassName("minutes");
        //for each minute it should update all indexes
        for(var i = 0; i < arrivals.length;i++){
            console.log("textContent",parseInt(minutes.item(i).textContent))
            //when one minute passes, if its zero, I equal to the frequency
            var minute = parseInt(minutes.item(i).textContent)
            var frequency = parseInt(frequencies.item(i).textContent)
            
            minute -= 1;

            if(minute == 0){
                minute = frequency
            }
            console.log(minute)
            minutes.item(i).innerHTML = minute
            // checo el arrival con la hora actual si es menor le sumo la frecuencia
            var nextArrival = arrivals.item(i).textContent
            var nextArrivalTime = moment(nextArrival,"HH:mm")
            if ( 0 < moment().diff(nextArrivalTime)){
                newTime = nextArrivalTime.add(frequency,"minutes")
                arrivals.item(i).innerHTML = newTime.format("HH:mm")
            }
        }
    }

    setInterval(update,60000)
    //store the values in firebase, each with its own key on click of "submit".

    $("#submit").on("click", function(event) {

        event.preventDefault();

        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        firstTrainTime = $("#firstTrainTime").val().trim();
        frequency = $("#frequency").val().trim();
        console.log(trainName);

        dataRef.ref().push({

            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency

        }) 
        
    //clear the form once the user hits "submit".

        $("#form").trigger("reset");

       





    });

});