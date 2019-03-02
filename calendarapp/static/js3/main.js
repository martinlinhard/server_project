var app = new Vue({
    el: '#vue-app',
    delimiters: ["<%", "%>"],
    data: {
        // total events --> pulled from the database
        events: [

        ],

        //Current properties
        currentMonth: 0,
        currentMonthS: "",
        currentYear: 0,

        // list which is created from events based on the current month
        currentEvents: [

        ],

        //Useful variable
        oldID : ""
    },

    methods: {
        showAddEventDialog: function () {
            document.getElementById("create").style.display = "block";
        },
        showEditEventDialog: function (event) {
            
            // Get element of events that is to be changed
            let currID = event.target.parentElement.id;
            let splittedValues = currID.split("~");
            this.oldID = currID;
            let currEvent;
            for (let i = 0; i < this.events.length; i++) {
                if
                    (this.events[i].title == splittedValues[0] &&
                    this.events[i].hours == splittedValues[1] &&
                    this.events[i].minutes == splittedValues[2] &&
                    this.events[i].day == splittedValues[3] &&
                    this.events[i].month == splittedValues[4] &&
                    this.events[i].content == splittedValues[5]) {
                        currEvent = this.events[i];
                }
            }

            //TODO: Change values (They get their values from the event object (currEvent))
            document.getElementById("editRealTitle").value = currEvent.title;
            document.getElementById("editDay").value = parseInt(currEvent.day);
            document.getElementById("editHour").value = parseInt(currEvent.hours);
            document.getElementById("editMin").value = parseInt(currEvent.minutes);
            document.getElementById("editContent").value = currEvent.content.replace(/<br>/g, "\n");
            
            //Show dialogue
            document.getElementById("edit").style.display = "block";
        },

        cancelEventDialog: function () {
            document.getElementById("create").style.display = "none";
            document.getElementById("edit").style.display = "none";
        },
        increaseMonth: function () {
            if (this.currentMonth == 12) {
                this.currentMonth = 1;
                this.updateMonthString();
                this.currentYear++;
            }
            else {
                this.currentMonth++;
                this.updateMonthString();
            }
            this.loadMonthData();
        },
        decreaseMonth: function () {
            if (this.currentMonth == 1) {
                this.currentMonth = 12;
                this.updateMonthString();
                this.currentYear--;
            }
            else {
                this.currentMonth--;
                this.updateMonthString();
            }
            this.loadMonthData();
        },
        updateMonthString: function () {
            switch (this.currentMonth) {
                case 1:
                    this.currentMonthS = "January";
                    break;
                case 2:
                    this.currentMonthS = "February"
                    break;
                case 3:
                    this.currentMonthS = "March";
                    break;
                case 4:
                    this.currentMonthS = "April";
                    break;
                case 5:
                    this.currentMonthS = "May";
                    break;
                case 6:
                    this.currentMonthS = "June";
                    break;
                case 7:
                    this.currentMonthS = "July";
                    break;
                case 8:
                    this.currentMonthS = "August";
                    break;
                case 9:
                    this.currentMonthS = "September";
                    break;
                case 10:
                    this.currentMonthS = "October";
                    break;
                case 11:
                    this.currentMonthS = "November";
                    break;
                case 12:
                    this.currentMonthS = "December";
                    break;
                default:
                    this.currentMonthS = "error";
                    break;
            }
        },
        deleteEvent: function (event) {
            let currID = event.target.parentElement.parentElement.parentElement.id;
            let splittedValues = currID.split("~");

            var delIndex;
            for (let i = 0; i < this.events.length; i++) {
                if
                    (this.events[i].title == splittedValues[0] &&
                    this.events[i].hours == splittedValues[1] &&
                    this.events[i].minutes == splittedValues[2] &&
                    this.events[i].day == splittedValues[3] &&
                    this.events[i].month == splittedValues[4] &&
                    this.events[i].content == splittedValues[5]) {
                    delIndex = i;
                }
            }

            var currEvent = JSON.parse(JSON.stringify(this.events[delIndex]));
            let request = {
                reqType: "deleteEvent",
                delEvent: currEvent
            };

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var reply = xhttp.responseText;
                    if(reply == "error"){
                        alert("Can't delete item!")
                        app.events.push(currEvent);
                        app.loadMonthData();
                    }
                }
            };
            
            app.events.splice(delIndex, 1);
            app.loadMonthData();

            xhttp.open("POST", "");
            xhttp.send(JSON.stringify(request));
        },
        loadMonthData: function () {
            let localEvents = [];
            
            for (event of this.events) {
                if (event.month == this.currentMonth && event.year == this.currentYear) {
                    localEvents.push(event)
                }
            }

            //Format objects in localEvents
            for(let i = 0; i < localEvents.length; i++){
                localEvents[i].hours = parseInt(localEvents[i].hours);
                localEvents[i].hours = app.n(localEvents[i].hours);
                localEvents[i].minutes = parseInt(localEvents[i].minutes);
                localEvents[i].minutes = app.n(localEvents[i].minutes);
                localEvents[i].day = parseInt(localEvents[i].day);
                localEvents[i].day = app.n(localEvents[i].day);
                localEvents[i].month = parseInt(localEvents[i].month);
                localEvents[i].month = app.n(localEvents[i].month);
            }
            
            // Display text properly
            for(let i = 0; i < localEvents.length; i++){
                localEvents[i].content = localEvents[i].content.replace(/\n/g, "<br>");
            }
            this.currentEvents = localEvents;
            this.sortCurrentEvents();
        },

        addEvent: function (isEdit, event) {
            let title = document.getElementById("realTitle").value;
            let day = document.getElementById("day").value;
            let hour = document.getElementById("hour").value;
            let min = document.getElementById("min").value;
            let content = document.getElementById("content").value;

            var newEvent = { day: parseInt(day), hours: parseInt(hour), title: title, minutes: parseInt(min), content: content, year: this.currentYear, month: this.currentMonth };
            
            let request = {
                reqType : "createEvent",
                event: newEvent
            };

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var reply = xhttp.responseText;
                    if(reply == "error"){
                        alert("Invalid data!")
                    }
                    else {
                        app.cancelEventDialog();
                        app.events.push(
                            newEvent
                        );
                        app.loadMonthData();
                    }
                }
            };
            
            xhttp.open("POST", "");
            xhttp.send(JSON.stringify(request));
            
            document.getElementById("realTitle").value = "";
            document.getElementById("day").value = "";
            document.getElementById("hour").value = "";
            document.getElementById("min").value = "";
            document.getElementById("content").value = "";
        },
        editEvent: function() {

            //edited fields
            let title = document.getElementById("editRealTitle").value;
            let day = document.getElementById("editDay").value;
            let hour = document.getElementById("editHour").value;
            let min = document.getElementById("editMin").value;
            let content = document.getElementById("editContent").value;
            
            let splittedValues = this.oldID.split("~");
            let indexOLD;
            for (let i = 0; i < this.events.length; i++) {
                if
                    (this.events[i].title == splittedValues[0] &&
                    this.events[i].hours == splittedValues[1] &&
                    this.events[i].minutes == splittedValues[2] &&
                    this.events[i].day == splittedValues[3] &&
                    this.events[i].month == splittedValues[4] &&
                    this.events[i].content == splittedValues[5]) {
                        //index of event which should be updated
                        indexOLD = i;
                }
            }
            //Zwei Kopien werden erzeugt, nur eine wird geupdated
            var oldEvent = JSON.parse(JSON.stringify(this.events[indexOLD]));
            var currEvent = JSON.parse(JSON.stringify(this.events[indexOLD]));
            // update currEvent
            currEvent.title = title;
            currEvent.day = parseInt(day);
            currEvent.hours = parseInt(hour);
            currEvent.minutes = parseInt(min);
            currEvent.content = content;

            let request = {
                reqType: "editEvent",
                oldEvent: oldEvent,
                newEvent: currEvent
            };

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var reply = xhttp.responseText;
                    if(reply == "error"){
                        alert("Invalid change!")
                    }
                    else {
                        app.events.splice(indexOLD, 1);
                        app.events.push(currEvent);
                        app.loadMonthData();
                        app.cancelEventDialog();
                    }
                }
            };
            
            xhttp.open("POST", "");
            xhttp.send(JSON.stringify(request));
        },
        getDaysInMonth: function() {
            return new Date(this.currentYear, this.currentMonth, 0).getDate();
        },
        sortCurrentEvents: function() {
            this.currentEvents.sort(function(a,b){
                return a.day - b.day;
            });
        },
        getData: function() {

            let request = {
                reqType: "getData",
            };

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var reply = JSON.parse(xhttp.responseText);
                    app.events = reply["events"];
                    app.loadMonthData();
                }
            };
            
            xhttp.open("POST", "");
            xhttp.send(JSON.stringify(request));
        },
        maybeCancel: function(event) {
            if(event.target.id == "createBG"){
                this.cancelEventDialog();
            }
        },
        n: function(n) {
            return n > 9 ? "" + n: "0" + n;
        }
    },
    beforeMount() {
        let month = new Date();
        this.currentMonth = month.getMonth() + 1;
        this.currentYear = month.getFullYear();
        this.updateMonthString();
        this.getData();
    },
})