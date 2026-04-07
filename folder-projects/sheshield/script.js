let lat;
let lon;

function getLocation() {
    navigator.geolocation.getCurrentPosition(function(pos) {
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        let map = "https://maps.google.com/maps?q=" + lat + "," + lon + "&z=15&output=embed";
        document.getElementById("mapFrame").src = map;
    }, function(error) {
        alert("Unable to detect location. Please allow location permissions.");
    });
}

function shareLocation() {
    if (!lat) {
        alert("Please tap 'Detect' to get your location first.");
        return;
    }
    let link = "https://maps.google.com/?q=" + lat + "," + lon;
    window.location.href = "sms:9943366440?body=" + encodeURIComponent("URGENT! My live location: " + link);
}

function callHelp() {
    window.location.href = "tel:112";
}

function sendSOS() {
    navigator.geolocation.getCurrentPosition(function(pos) {
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        let policeRoute = "https://www.google.com/maps/dir/" + lat + "," + lon + "/police+station";
        alert("SOS Activated! Opening fastest route to the nearest police station.");
        window.open(policeRoute, "_blank");
    }, function() {
        alert("Location access is needed to find the nearest police station.");
    });
}

function toggleDark() {
    document.body.classList.toggle("dark");
    const themeIcon = document.getElementById('themeIcon');
    if(document.body.classList.contains("dark")) {
        themeIcon.innerText = "☀️";
    } else {
        themeIcon.innerText = "🌙";
    }
}
