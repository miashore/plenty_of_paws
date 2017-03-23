
$(document).ready(function() {
    var petObject = null;
    $('#homeModal').modal('show');
    $(".animalType").on("click", getRandomPet);
    $(".userLocationSubmit").on("click",getPets);
});
/*
 * getPets - function for finding a shelter (shelterFinder) and finding pets at that shelter (shelterPets)
 * @params none (for the moment)
 */
function getPets(){
    console.log($(this).val());
    shelterFinder();
}
/*
 * createMap - Makes map
 * @params obj that contains stuff
 */
function createMap(obj){
    $("#map").googleMap({
        zoom: 14,
        coords: [obj.latitude,obj.longitude] // Map center (optional)
    });
    $("#map").addMarker({
        coords: [obj.latitude,obj.longitude],
        title: obj.address.name,
        text: obj.address.text
    });
}
/*
 * infoForMap - gets latitude and longitude information from the shelterArray. Stores the latitude and longitude of the shelter in a key:value pair
 * @params - none
 * return - coordObj
 */
function infoForMap(){
    var index = 0;
    var coordObj = {};
    coordObj.address = {};
    coordObj.latitude = parseFloat(shelterArray[index].latitude['$t']);
    coordObj.longitude = parseFloat(shelterArray[index].longitude['$t']);
    coordObj.address.name = shelterArray[index].name['$t'];
    coordObj.address.city = shelterArray[index].city['$t'];
    coordObj.address.state = shelterArray[index].state['$t'];
    coordObj.address.text = coordObj.address.city + ', ' + coordObj.address.state;
    return coordObj;
}
/*
 * displayMap - function for displaying the map from the coordinates returned by infoForMap
 * @params - none
 */
function displayMap(){
    var coordinates = infoForMap();
    createMap(coordinates);
}
/*
 displayPet - function to append the DOM to display the animal's profile
 @params response["petfinder"]["pets"]
 */
var petDetails = ["name","age","description"]; // media.photos.photo[i] for images of dog
function displayPet(petObject) {
    for (var i = 0; i < petObject.length; i++) {
        var petProfile = $("<div>").addClass("petProfile");
        var petPicture = $("<img>");
        var petPictureHolder = $("<div>");
        petPicture.attr("src", petObject[i]["media"]["photos"]["photo"][2]["$t"]).addClass("animalPicture"); // ...["photo"][2]["$t"] seems to be the largest image that won't require splicing out part of the string. For the time being, "good enough" -ADG
        petPictureHolder.append(petPicture);
        petProfile.append(petPictureHolder);
        var petName = $("<div>").text(petObject[i]["name"]["$t"]);
        var petDescription = $("<div>").text(petObject[i]["description"]["$t"]);
        petProfile.append(petName, petDescription);
        $("body").append(petProfile);
    }
}

/*
 * displayRandomPet - function for displaying a random pet from somewhere in the petfinder database
 * @params - petObject
 * return - Nothing
 */
function displayRandomPet(petObject) {
    var petProfile = $("<div>");
    var petPicture = $("<img>");
    var petPictureHolder = $("<div>");
    petPicture.attr("src",petObject["media"]["photos"]["photo"][0]["$t"]).addClass("animalPicture");
    petPictureHolder.append(petPicture);
    petProfile.append(petPictureHolder);
    for (var i = 0; i < petDetails.length; i++) {
        petProfile.append(petObject[petDetails[i]]["$t"]);
    }
    $("body").append(petProfile);
}
/*
 * getRandomPet - Based on user click get a random dog or cat
 * May need to transition this to shelter.getPet and randomize the results or something like that
 */
function getRandomPet() {
    console.log($(this)); //$(this) = button.animalType
    var dataObject = {
        format: "json",
        key: "1db51d3f16936ba505cf7a0476dd8771",
        animal: $(this).text(),
        output: "basic"
    };
    var urlString = "http://api.petfinder.com/pet.getRandom?format=json" + "&" + dataObject["animal"] + "&" + dataObject["output"] + "&" + "callback=?";
    $.ajax({
        data: dataObject,
        dataType: "JSON",
        method: "GET",
        url: urlString, //"http://api.petfinder.com/pet.getRandom", // petFinder.php",
        success: function (response) {
            console.log("Random pet", response["petfinder"]["pet"]);
            petObject = response["petfinder"]["pet"];
            displayRandomPet(petObject);
        },
        error: function (response) {
            console.log(response);
        }
    });
}

var shelterArray = [];
var petArray = [];
/*
 * shelterFinder - function for finding a shelter based on the user submitted location. Also updats the shelter list
 * @params - none
 */
var shelterFinder = function () {
    var dataObject = {
        format: "json",
        key: "579d9f154b80d15e1daee8e8aca5ba7a",
        location: $(".userLocation").val(),
        output: "full",
        count: 5
    };
    var urlString = "http://api.petfinder.com/shelter.find?format=json" + "&" + dataObject["location"] + "&" + dataObject["output"] + "&" + "callback=?";
    $.ajax({
        url: urlString,
        type: 'GET',
        data: dataObject,
        dataType: 'json',
        success: function (result) {
            console.log(result);
            //shelterObj = result["petfinder"]["shelters"]
            for(var i = 0; i < result.petfinder.shelters.shelter.length; i++) {
                shelterArray.push(result.petfinder.shelters.shelter[i]);
            }
            shelterPets(shelterArray);
            displayMap();
        }
    });
};


function getRandomShelterBasedOnAreaCode(shelterArray) {
    for (var i = 0; i < shelterArray.length; i++) {
        var randomShelterID = Math.floor(Math.random()*shelterArray.length);
        return shelterArray[randomShelterID]["id"]["$t"];
    }
}
var shelterPets = function () {
    $.ajax({
        url: 'http://api.petfinder.com/shelter.getPets?key=579d9f154b80d15e1daee8e8aca5ba7a&output=full&format=json&callback=?',
        type: 'GET',
        data: {
            id: getRandomShelterBasedOnAreaCode(shelterArray)
        },
        dataType: 'json',
        success: function (result) {
            console.log("shelterPets",result);
            for(var i = 0; i < result.petfinder.pets.pet.length; i++) {
                petArray.push(result.petfinder.pets.pet[i])
            }
            for(var j = 0; j < petArray.length; j++){
                $('.table tbody').append(petArray[j].name.$t);
            }
            displayPet(result.petfinder.pets.pet);
            return petArray;
        }
    });
};
