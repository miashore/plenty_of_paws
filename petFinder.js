$(document).ready(function() {
    var petObject = null;
    $('#homeModal').modal('show');
    //$(".animalType").on("click", getRandomPet);
    $(".animalType").on("click", assignAnimalType);
    $(".animalType").on("click", getPets);
    //$("#homeModal").on("click", resetEverything);
    $(".animalType").on("click", newSearch);
    $(".walmart").hide();

});





var newSearch = function () {

    $('#petInfo').empty();
    shelterArray = [];
    petArray = [];
    (nextShelterButton !== null) ? (emptyAnimalDOM()) : (''); // Empty the animal dom only if the nextShelter button is there. If not, do nothing
};

var userSelectedAnimal = null;
var nextShelterButton = null;
/**
 * assignAnimalType - gets the text of the button pressed to know the animal* @name assign
 * @params none
 */
function assignAnimalType() {
    userSelectedAnimal = $(this).text();
}
/**
 * getPets - function for finding a shelter (shelterFinder) and finding pets at that shelter (shelterPets); userSelectedAnimal picks up value
 * @params none
 */
function getPets(){
    //var userSelectedAnimal = $(this).text();
    shelterFinder();
}
/**
 * @name createMap - Makes map from the values of the latitude and longitude keys
 * @params {object} obj
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
/**
 * @name infoForMap - gets latitude and longitude information from the shelterArray. Stores the latitude and longitude of the shelter in a key:value pair
 * @params - none
 * @return coordObj {object}
 */
function infoForMap(){
    var coordObj = {
        address : {
            state : shelterArray[shelterCount].state['$t'],
            city : shelterArray[shelterCount].city['$t'],
            name : shelterArray[shelterCount].name['$t']
        },
        latitude : parseFloat(shelterArray[shelterCount].latitude['$t']),
        longitude : parseFloat(shelterArray[shelterCount].longitude['$t'])
    };
    coordObj.address.text = coordObj.address.city + ', ' + coordObj.address.state;
    return coordObj;
}
/**
 * @name - displayMap - function for displaying the map from the coordinates returned by infoForMap. Calls createMap with parameter of coordinates
 * @params - none
 */
function displayMap(){
    var coordinates = infoForMap();
    createMap(coordinates);
}


function displayPet(petObject) {
    if (petObject.length > 0) {

        for (let i = 0; i < petObject.length; i++) {
            let petCard = $("<div class='card'>");
            let cardMedia = $("<div class='cardMedia'>");
            let petName = petObject[i]["name"]["$t"];
            let cardTitle = $("<div class='cardTitle'>").text(petName); // Make the petName the cardTitle
            let cardActions = $("<div class='cardActions'>");
            // let likeButton = $("<button class='likeButton'>");
            let likeIcon = $("<i class='material-icons'>").text("favorite").addClass('likeIcon');
            let petAge = petObject[i]["age"]["$t"];
            let petAgeDiv = $("<div class=petAge>").text(petAge); // Pet age. Some have years, some just list a general age, e.g. "Adult"
            let petGender = petObject[i]["sex"]["$t"];
            let petGenderDiv = $("<div class=petAge>").text(petGender); // male/female
            let petDescription = petObject[i]["description"]["$t"];
            let petDescriptionDiv = $("<div class=petDescription>").text(petDescription);
            let petInfoDiv = $("<div class='petInfoExtended'>");
            petInfoDiv.append(petAgeDiv, petGenderDiv, petDescriptionDiv);
            // When the user clicks the like icon, append the extended information onto the card
            cardMedia.on("click", function () {
                petInfoDiv.stop().slideToggle("slow");
            });
            if (petObject[i]["media"]["photos"] !== undefined) {
                // set the background image of the card media div = to the pet's image
                // In the response from the PetFinder API, the index=2 of the media.photos.photo array contains an image of the dog that has a width of 500. The 0 and 1 indices are smaller widths
                $(cardMedia).css("background-image", `url("${petObject[i]["media"]["photos"]["photo"][2]["$t"]}")`);
                // $(petCard).css("background-image", `url("${petObject[i]["media"]["photos"]["photo"][2]["$t"]}")`);
            } else {
                console.log("No photo found"); // TODO pick a default photo in case there is not a photo there
            }
            petCard.append(cardMedia);
            cardMedia.append(cardTitle);
            petCard.append(petInfoDiv); // Append the petInfoDiv to the card with display property of none
            $(".animalCards").append(petCard);
        }
        // Append the shelter information to the animalShelterInformaiton div that sits above the animal cards
        let shelterName = $("<div>").text(shelterArray[shelterCount]["name"]["$t"]).addClass('shelterName');
        let shelterContact = $("<div>").text(petObject[0]["contact"]["email"]["$t"]).addClass('petContact'); // for shelters, the email address is the same, so pick off the email address from the first animal in the array
        $(".animalShelterInformation").append(shelterName, shelterContact);
    } else {
        let noMoreAnimals = `This shelter does not have any ${userSelectedAnimal}s available for adoption`;
        $("#petInfo").append($("<div class='noMoreAnimals'>").text(noMoreAnimals));
    }
    nextShelterButton = $('<button>', {
        text: 'Next Shelter',
        class: "btn btn-danger nextButton",
        click: nextShelter
    });
    $('.mainContent').append(nextShelterButton);
}
/**
 @name displayPet - function to append the DOM to display the animal's profile
 @params petObject => response["petfinder"]["pets"]
 */
var petDetails = ["name","age","description"]; // media.photos.photo[i] for images of dog

var walmartStuff = function () {
    $(".walmart").show(); // make walmart content visible on DOM
    $(".walmart div").remove();
    suggestion.getItemInformation();
    // suggestion.findNearestStoreFromShelter();
    server.walmartLocator(infoForMap());
};


/**
 * @name - displayRandomPet - function for displaying a random pet from somewhere in the petfinder database
 * @params - petObject
 * @return none
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
    $(".mainContent").append(petProfile);
}
/**
 * @name - getRandomPet - Based on user click get a random dog or cat
 * @note - May need to transition this to shelter.getPet and randomize the results or something like that
 */
function getRandomPet() {
    var dataObject = {
        format: "json",
        key: "1db51d3f16936ba505cf7a0476dd8771",
        animal: $(this).text(),
        output: "basic"
    };
    var urlString = "https://api.petfinder.com/pet.getRandom?format=json" + "&" + dataObject["animal"] + "&" + dataObject["output"] + "&" + "callback=?";
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
var shelterCount = 0;
/**
 * @name - shelterFinder - function for finding a shelter based on the user submitted location. Also updates the shelter list
 * @params - none
 * dataObject @type
 */
var shelterFinder = function () {
    var dataObject = {
        format: "json",
        key: "579d9f154b80d15e1daee8e8aca5ba7a",
        location: $(".userLocation").val(),
        output: "full",
        count: 5
    };
    // Quick hard coded error handling for empty input fields
    ($(".userLocation").val().length < 4) ? (dataObject.location = "90210") : (dataObject.locaction = $("userLocation").val());
    let shelterFinderURL = `https://api.petfinder.com/shelter.find?format=json&${dataObject["location"]}&${dataObject["output"]}&callback=?`;
    $.ajax({
        url: shelterFinderURL,
        type: 'GET',
        data: dataObject,
        dataType: 'json',
        success: function (result) {
            // console.log(result);
            for(var i = 0; i < result.petfinder.shelters.shelter.length; i++) {
                shelterArray.push(result.petfinder.shelters.shelter[i]);
            }
            shelterPets(shelterArray);
            displayMap();
            suggestion.getItemInformation();
            //suggestion.findNearestStoreFromShelter();
        }
    });
};

function getRandomShelterBasedOnAreaCode(shelterArray) {
    var randomShelterID = shelterArray[shelterCount];
    return shelterArray[shelterCount]["id"]["$t"];
}
var shelterPets = function () {
    $.ajax({
        url: 'https://api.petfinder.com/shelter.getPets?key=579d9f154b80d15e1daee8e8aca5ba7a&output=full&format=json&callback=?',
        type: 'GET',
        data: {
            id: getRandomShelterBasedOnAreaCode(shelterArray)
        },
        dataType: 'json',
        success: function (result) {
            // console.log("shelterPets", result);
            if(result.petfinder.pets.pet !== undefined) {
                for (var i = 0; i < result.petfinder.pets.pet.length; i++) {
                    if (result.petfinder.pets.pet[i].animal.$t == userSelectedAnimal) {
                        petArray.push(result.petfinder.pets.pet[i]);
                    }
                }
            }
            displayPet(petArray);
        }
    });
};
/*
 * instantiation of serverConstructor
 */
var server = new serverConstructor();
var suggestion = new suggestionConstructor();

function suggestionConstructor() {
    this.items = {
        dog: ['food', 'treats', 'toy', 'collar+leash'],
        cat: ['food,', 'bowl', 'litter+box', 'scratching+post']
    };

    this.getItemInformation = function () {
        for (var i = 0; i < suggestion.items[userSelectedAnimal.toLowerCase()].length; i++) {
            server.checkWalmart(userSelectedAnimal.toLowerCase(), suggestion.items[userSelectedAnimal.toLowerCase()][i]);
        }
    };
}
function serverConstructor() {
    this.checkWalmart = function (passedAnimal, passedItem) {
        const WALMART_URL = "http://api.walmartlabs.com/v1/search?query=";
        $.ajax({
            "url": `${WALMART_URL}${passedAnimal}${passedItem}+&format=json&apiKey=5pw9whbkctdk92vckbgewxky`,
            "dataType": "jsonp",
            "method": "get",
            "success": function (walmartItemInfo) {
                var randomProduct = Math.floor(Math.random() * walmartItemInfo.items.length);
                var keys = ["mediumImage","name", "stock" , "salePrice"];
                keys[0] = `<img src=${walmartItemInfo.items[randomProduct][keys[0]]}>`;
                for(var i = 1; i  < keys.length; i++){
                    keys[i] = `<div class="walmartTest">${walmartItemInfo.items[randomProduct][keys[i]]}</div>`;
                }
                $(".walmart").append("<div><a href=" + walmartItemInfo.items[randomProduct].productUrl + "><div class='thumbnail'>" + keys.join("<br>") + "</div></a></div>");

            },
            "error": function () {
                console.log('network timeout');
            }
        });
    };

    this.walmartLocator = function (coordinates) {
        let walmartLocatorURL = `http://api.walmartlabs.com/v1/stores?format=json&lat=${coordinates.latitude}&lon=${coordinates.longitude}&apiKey=5pw9whbkctdk92vckbgewxky`;
        $.ajax({
            url: walmartLocatorURL,
            "dataType" : "jsonp",
            "method" : "get",
            "success" : function (walmartLocation) {
                $(function() {
                    $("#map").googleMap();
                    for(var i = 0; i < 10; i++){
                        $("#map").addMarker({
                            coords: [parseFloat(walmartLocation[i].coordinates[1]), parseFloat(walmartLocation[i].coordinates[0])],
                            title: walmartLocation[i].name,
                            text:  walmartLocation[i].streetAddress + " " + walmartLocation[i].city + " " + walmartLocation[i].stateProvCode + " " + walmartLocation[i].zip
                        });
                    }
                });
            }
        });
    };
}
var resetEverything = function () {
    petArray = [];
    shelterArray = [];
    userSelectedAnimal = null;
    shelterCount = 0;
    $('.noMoreShelters').remove();
    $('.userLocation').val(''); // Empty the zip code when you reset everything
    let newSearch = $("<a href='index.html/#homeModal' class='btn' data-toggle='modal'>").text("New Search?");
    $(".animalCards").append(newSearch)
};


var nextShelter = function () {
    petArray = [];
    emptyAnimalDOM(); // Empty the DOM for all information about the animals

    if (shelterCount < 4){
        shelterCount++;
    }
    else if(shelterCount >= 4){
        shelterCount = 0;
        let noMoreShelters = $("<div class='noMoreShelters'>").text("No more shelters in your area");
        $(".animalCards").append(noMoreShelters);
        resetEverything();
        return;
    }
    displayMap();
    shelterPets();
};


// jQuery methods empty the DOM for the animal information sections
var emptyAnimalDOM = function() {
    nextShelterButton.remove();
    $('.animalCards').empty();
    $('.animalShelterInformation').empty();
    $('.noMoreAnimals').remove();
};