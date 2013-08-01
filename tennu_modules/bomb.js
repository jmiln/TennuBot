var config = require('../config/mibbit.json');

module.exports = function TennuBombModule (tennu) {

    time = 10;
    defused = false;
    colorList = ["red", "blue", "green", "yellow", "black"];
    defuseColor = "";
    reciever = "";
    channel = "";

    var timer = new Countdown({  
        seconds:time, 
        onUpdateStatus: function(sec){
            if(sec <= 5) {
                tennu.say(channel, sec);
            }
        },
        onCounterEnd: function(){
            det(channel);
        }  
    });

    function bomb (command) {
            channel = command.channel;
        if(command.args[0] == "" || command.args[0] == null){
            tennu.say(channel, "You need to specify a target " + command.sender);
        } else if(reciever != "") {
            tennu.say(channel, "There is already a bomb in play") 
        } else {
            defused = false;
            reciever = command.args[0];
            tennu.say(channel, reciever + " recieves the bomb. You have " + time + " seconds to defuse it using by cutting the right cable with (" + config.trigger + "cut <color>).");
            tennu.say(channel, "Your choices are: " + colorList.join(", "));
            defuseColor = colorList[Math.floor(Math.random() * colorList.length)];
            timer.start();
        }
    }

    function cut (command) {
        if(command.args[0] == "" || command.args[0] == null){
            tennu.say(channel, "You need to specify a color to cut " + command.sender);
        } else if(reciever == "") {
            tennu.say(channel, "There is currently no bomb to cut into little pieces");
        } else if(command.sender != reciever) {
            tennu.say(channel, "The bomb is not yours to defuse");
        } else {
            if(command.args[0] != defuseColor) {
                det(channel); 
            } else {
                tennu.say(channel, reciever + " has defused he bomb in time.");
                reciever = "";
            }
        }
    }

    function det (channel) {
        tennu.say(channel,"The bomb has exploded in " + reciever + "'s hands, the correct color would have been: " + defuseColor);
        defused = true;
        reciever = "";
    }

    function Countdown(options) {
        var timer,
            instance = this,
            seconds = options.seconds,
            updateStatus = options.onUpdateStatus,
            counterEnd = options.onCounterEnd;

        function decrementCounter() {
            if(defused == true) {
                clearInterval(timer);
            } else {
                updateStatus(seconds);
                if (seconds === 0) {
                    counterEnd();
                    instance.stop();
                }
                seconds--;
            }
        }

        this.start = function () {
            clearInterval(timer);
            timer = 0;
            seconds = options.seconds;
            timer = setInterval(decrementCounter, 1000);
        };

        this.stop = function () {
            clearInterval(timer);
        };
    }


    return {
        handlers : {
            "!bomb" : bomb,
            "!cut" : cut
        }
    };
};