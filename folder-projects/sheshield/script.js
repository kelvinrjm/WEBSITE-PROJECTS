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

let map="https://maps.google.com/maps?q="+lat+","+lon+"&z=15&output=embed";

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

let link="https://maps.google.com/?q="+lat+","+lon;

window.location.href="sms:9943366440?body="+encodeURIComponent("My location: "+link);

}

function callHelp(){
window.location.href="tel:112";
}

function sendSOS(){

navigator.geolocation.getCurrentPosition(function(pos){

lat = pos.coords.latitude;
lon = pos.coords.longitude;

let safePlaces =
"https://www.google.com/maps/search/police+station+OR+police+booth+OR+hospital/@"+lat+","+lon+",15z";

alert("SOS Activated. Showing nearby safe places.");

window.open(safePlaces,"_blank");

}, function(){
alert("Unable to detect GPS location.");
}, gpsOptions);

}

function toggleDark(){
document.body.classList.toggle("dark");
}
