let lat;
let lon;

function getLocation(){

navigator.geolocation.getCurrentPosition(function(pos){

lat = pos.coords.latitude;
lon = pos.coords.longitude;

let map="https://maps.google.com/maps?q="+lat+","+lon+"&z=15&output=embed";

document.getElementById("mapFrame").src = map;

});

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

let policeRoute =
"https://www.google.com/maps/dir/"+lat+","+lon+"/police+station";

alert("SOS Activated. Navigating to nearest police station.");

window.open(policeRoute,"_blank");

});

}

function toggleDark(){

document.body.classList.toggle("dark");

}
