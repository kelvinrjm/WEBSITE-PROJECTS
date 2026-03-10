let lat;
let lon;

const gpsOptions = {
enableHighAccuracy: true,
maximumAge: 10000,
timeout: 5000
};

function getLocation(){

navigator.geolocation.getCurrentPosition(function(pos){

lat = pos.coords.latitude;
lon = pos.coords.longitude;

let map = "https://maps.google.com/maps?q=" + lat + "," + lon + "&z=15&output=embed";

document.getElementById("mapFrame").src = map;

}, function(){
alert("Unable to detect location. Please enable GPS.");
}, gpsOptions);

}

function shareLocation(){

if(!lat){
alert("Please detect location first");
return;
}

let link = "https://maps.google.com/?q=" + lat + "," + lon;

window.location.href =
"sms:9943366440?body=" + encodeURIComponent("My location: " + link);

}

function callHelp(){
window.location.href = "tel:112";
}

function sendSOS(){

navigator.geolocation.getCurrentPosition(function(pos){

lat = pos.coords.latitude;
lon = pos.coords.longitude;

let route =
"https://www.google.com/maps/dir/?api=1&origin="
+ lat + "," + lon +
"&destination=police+station&destination_place_id=&travelmode=walking";

alert("SOS Activated. Showing the nearest safest route to a police station.");

window.open(route,"_blank");

}, function(){
alert("Unable to detect GPS location.");
}, gpsOptions);

}

function toggleDark(){

document.body.classList.toggle("dark");

}
