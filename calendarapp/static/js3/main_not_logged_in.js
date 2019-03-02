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