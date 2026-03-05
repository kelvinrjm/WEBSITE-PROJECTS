let lat;
let lon;

function getLocation(){

navigator.geolocation.getCurrentPosition(function(pos){

lat=pos.coords.latitude;
lon=pos.coords.longitude;

let map="https://maps.google.com/maps?q="+lat+","+lon+"&z=15&output=embed";

document.getElementById("mapFrame").src=map;

});

}

function shareLocation(){

if(!lat){
alert("Please detect location first");
return;
}

let link="https://maps.google.com/?q="+lat+","+lon;

let message="EMERGENCY! My location: "+link;

window.location.href="sms:9943366440?body="+encodeURIComponent(message);

}

function callHelp(){
window.location.href="tel:112";
}

function findPolice(){

if(!lat){
alert("Get location first");
return;
}

let url="https://www.google.com/maps/search/police+station/@"+lat+","+lon+",14z";

window.open(url,"_blank");

}

function sendSOS(){

let alarm = document.getElementById("alarm");

alarm.currentTime = 0;
alarm.play();

alert("🚨 SOS ACTIVATED! HELP NEEDED!");

}

function toggleDark(){
document.body.classList.toggle("dark");
}

/* SHAKE PHONE SOS */

let shakeThreshold=15;
let lastX,lastY,lastZ;

window.addEventListener("devicemotion",function(e){

let acc=e.accelerationIncludingGravity;

let x=acc.x;
let y=acc.y;
let z=acc.z;

if(lastX!==null){

let delta=Math.abs(x+y+z-lastX-lastY-lastZ);

if(delta>shakeThreshold){

sendSOS();

}

}

lastX=x;
lastY=y;
lastZ=z;

});
