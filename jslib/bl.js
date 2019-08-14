
mqttClient = null;
mqttConnected = false;
var nReconnect = 0;

// mqttClientID
clientID = document.querySelector("firebase-auth").user.email;
topicID = clientID;
clientID = clientID.replace("@",".");

clientID = clientID+"-"+randomID();

// Listener topic add "/ack" after testing
topicSwitch = topicID+"/switch/ack";

hostName = "broker.standager.com";
port = 9883;
keepAlive = 60;
tls = true;
timeout = 3;
cleanSession = true;

mqttClient = new Paho.MQTT.Client(hostName,port,clientID);
mqttClient.onMessageArrived = onMessage;
mqttClient.onConnectionLost = onConnectionLost;

var options = {
    invocationContext: {host : hostName, port: port, path: mqttClient.path, clientId: clientID},
    timeout: timeout,
    keepAliveInterval:keepAlive,
    cleanSession: cleanSession,
    useSSL: tls,
    onSuccess: onConnect,
    onFailure: onFail,
    userName: topicID,
    password: localStorage.getItem("ak")
};

mqttClient.connect(options);

function onConnect(context){
    console.log("Client connected");
    mqttConnected = true;
    nReconnect = 0;
    document.querySelector(".circle").style.background = "#4caf50";
    subscribe(topicSwitch,2);
}

function onConnectionLost(resObject) {
    if (resObject.errorCode != 0) {
        console.log("Connection Lost: "+resObject.errorMessage);
    }
    document.querySelector(".circle").style.background = "#f44336";
    mqttConnected = false;
    if (nReconnect < 3) {
        mqttClient.connect(options);
        nReconnect++;
    }
}

function onFail(context){
    console.log("Failed to connect");
    mqttConnected = false;
}


function disconnect(){
    console.log('Disconnect from server');
    mqttClient.disconnect();
    mqttConnected = false;
}

function onMessage(message){
    console.log('Message Recieved: Topic: ', message.destinationName, '. Payload: ', message.payloadString, '. QoS: ', message.qos);
    
    var be = document.getElementById('outlets-list');
    var ptblist = be.querySelectorAll("paper-toggle-button");

    
    if (message.destinationName == topicSwitch){
        var x;
        for (x = 0; x < ptblist.length; x++) {
            if (JSON.stringify(ptblist[x].outlet)==message.payloadString){
                var mat = ptblist[x].parentNode.parentNode.parentNode.querySelector("mat-progress");
                mat.value = 0;
                mat.mode = "determinate";
                mat.color = "green";
                var mval = 0;
                function ani(timestamp){
                    mval += 2;
                    mat.value = mval;
                    if (mval < 100) {
                        requestAnimationFrame(ani);
                    }
                    
                };

                requestAnimationFrame(ani);
                var fade = 1.0;
                function fadeOut(ts){
                    fade -= 0.05;
                    mat.style.opacity = fade;
                    if (fade > 0.0) {
                        requestAnimationFrame(fadeOut);
                    } else {
                        mat.showed = false;
                        mat.value = 0;
                        mat.color = "blue";
                        mat.mode = "query";
                        mat.style.opacity = 1.0;
                    }
                }
                setTimeout(fadeOut,1250);
            }
        }
    }
}

function subscribe(topic, qos){
    console.log('Subscribing to: Topic: ', topic, '. QoS: ', qos);
    mqttClient.subscribe(topic, {qos: qos});
}

function publish(topic, message, qos){
    console.log('Publishing rubish');

    msend = new Paho.MQTT.Message(message);
    msend.destinationName = topicID+"/"+ topic;
    msend.qos = qos;
    msend.retained = false;
    mqttClient.send(msend);
}

// Random client-ID
function randomID()
{
    var text = "";
    var language = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < 5; i++) {
        text += language.charAt(Math.floor(Math.random()*language.length));
    }

    return text;
}