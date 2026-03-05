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
alert("Detect location first");
return;
}

let link="https://maps.google.com/?q="+lat+","+lon;

window.location.href="sms:9943366440?body="+encodeURIComponent("My location: "+link);

}

function findPolice(){

if(!lat){
alert("Detect location first");
return;
}

let url="https://www.google.com/maps/search/police+station/@"+lat+","+lon+",14z";

window.open(url,"_blank");

}

function callHelp(){
window.location.href="tel:112";
}

function toggleDark(){
document.body.classList.toggle("dark");
}

function activateSOS(){
document.getElementById("sosScreen").style.display="flex";
}

function closeSOS(){
document.getElementById("sosScreen").style.display="none";
}
