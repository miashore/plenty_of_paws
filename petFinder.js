$(document).ready(function() {
    setup();
});

/**
 * setup - setup calls and consolidates the functions necessary for when the page loads
 * @params none
 */
function setup(){
    randomBackground();
    attachClickHandlers();
}
/**
 * attachClickHandlers - consolidates and attaches the event handlers
 * @params none
 */
function attachClickHandlers(){
    $(".animal-type").on("click", assignAnimalType);
    $(".animal-type").on("click", getPets);
    $(".animal-type").on("click", newSearch);
    $(".animal-type").on("click", addCssClasses);
    $(".walmart-suggestion").on("click", () => {
        walmartSuggestionInstantiation();
        $(".walmart-suggestion").css('display', 'none'); // Hide the walmart button after the first click
    });
}
/**
 * addCssClasses - adds a class that has a blur effect on page load, a class for more legible shelter contact info, and created for consistency in the attachClickHandlers function
 * @params none
 */
function addCssClasses(){
    $('.blur-container').addClass("blur-filter");
    $('.shelter-contact').addClass('shelter-legibility');
}
/**
 * walmartSuggestionInstantiation - creates a new instance of WalmartSuggestionInformation and created for consistency in the attachClickHandlers function
 * @params none
 */
function walmartSuggestionInstantiation(){
    const walmartAPI = new WalmartSuggestionInformation(); // make a new instance from the WalmartSuggestionInformation constructor
    walmartAPI.getItemInformation(); // use the getItemInformation method to make the network request for the information.
}
/**
 * randomBackground - randomly selects a class that is responsible for a background image and styling
 * @params none
 */
function randomBackground(){
    let chosenBg = Math.round(Math.random()*2);
    let bg = $('.blur-container');
    let bgClasses = ["cat-bg", "dog-bg", "puppy-bg"];
    if(chosenBg >= bgClasses.length || chosenBg < 0){
        bg.css('background-color', '#E2E1E0');
    }
    bg.addClass(bgClasses[chosenBg]);
}


var newSearch = function () {
    $('#pet-info').empty(); // remove the elements from the DOM and destroy click handlers
    shelterArray = []; // Empty the list of stored shelters
    petArray = []; // Empty the list of stored pets from that search
    (nextShelterButton !== null) ? (emptyAnimalDOM()) : (''); // Empty the animal dom only if the nextShelter button is there. If not, do nothing
};

// While there may be a configuration that does not require
// the userSelectedAnimal, nextShelterButton, and previousShelterButton variables to be in the global
// name space,  a global scoping configuration is functional for the purposes of polishing the UI.
var userSelectedAnimal = null;
var nextShelterButton = null;
var previousShelterButton = null;
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
    // hide the input form after the user searches for it
    toggleVisibility('animalSearch');
    window.location.hash = '#search'; // set the hash to search so the routing back to the index.html for multiple searches can work will minimal rework
    shelterFinder();
}

/**
 * @name descriptionFilter - Used to normalize the description text from the PetFinder API
 * @param descriptionText {string}
 * @returns {object}
 */
function descriptionFilter(descriptionText) {

    // start with default values in case the regex returns null
    let petDescription =  {
        size: "Cuddleable",
        demeanor: ["Loveable"]
    };
    // Matches (1 or more digit weights = [0-9]+) pound(s) or lb(s)
    // with an optional period at the end of lb(s) in case of abbreviation
    const descriptionRegEx = {
        "size": new RegExp(/[0-9]+[\s]*(pound[s]?|lb[s]?[.]?)/,'i'),
        "gentle": new RegExp(/(gentle)/, 'i'),
        "calm": new RegExp(/(calm)/,'i'),
        "lovingSweet": new RegExp(/(loving)|(sweet)/, 'i'),
    };
    const descriptionRegExKeys = Object.keys(descriptionRegEx); // For the for loop. Probably not the best
    // Assign to a variable, so the test does not run multiple times in the ternary
    let size = descriptionRegEx.size.exec(descriptionText); // exec returns an array, so we'll grab the result in the ternary
    // Could probably do this ternary without doing the assignment, but clever code is not always maintainable code
    // if the regex could not find a match, the *.exec method returns null
    (size) ? (petDescription.size = size[0]) : (petDescription.size = "Unknown");

    // There are only 4 options, but if the list expands something like this would work i < Object.keys(demeanorRegEx).length
    for (let i = 1; i < 4 ; i++) {
        let attribute = descriptionRegEx[descriptionRegExKeys[i]].exec(descriptionText); // Assign to variable to avoid recalculate
        (attribute) ? (petDescription.demeanor.push(` ${attribute[0]}`)) : ('');
    }

    return petDescription;
}

/**
 @name displayPet - function to append the DOM to display the animal's profile
 @params petObject => response["petfinder"]["pets"]
 */
function displayPet(petObject) {
    if (petObject.length > 0) {

        for (let i = 0; i < petObject.length; i++) {
            let petCard = $("<div class='card col-xs-10 col-xs-offset-1 col-sm-3 col-sm-offset-0'>");
            let cardMedia = $("<div class='card-media img-fluid'>");
            let petName = petObject[i]["name"]["$t"];
            let cardTitle = $("<div class='card-title'>").text(petName); // Make the petName the cardTitle
            let petAge = petObject[i]["age"]["$t"];
            let petAgeDiv = $("<div class=pet-age>").text(petAge); // Pet age. Some have years, some just list a general age, e.g. "Adult"
            let petGender = petObject[i]["sex"]["$t"];
            (petGender === "F") ? (petGender = "Female") : (petGender = "Male"); // Format the gender to more than just F/M
            let petGenderDiv = $("<div class=pet-age>").text(petGender); // male/female
            let petDescriptionObject = descriptionFilter(petObject[i]["description"]["$t"]); // pass the petDescription into the filter;
            let petSize = $("<p>").text(`Size/Weight: ${petDescriptionObject.size}`);
            let petDemeanor = $("<p>").text(`Demeanor: ${petDescriptionObject.demeanor}`);
            let petDescriptionDiv = $("<div class=pet-description>");
            petDescriptionDiv.append(petSize, petDemeanor);
            let petInfoDiv = $("<div class='pet-info-extended col-xs-12'>");
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
                $(cardMedia).css("background-image", `url(images/No-image-found.jpg)`);
            }
            petCard.append(cardMedia);
            cardMedia.append(cardTitle);
            petCard.append(petInfoDiv); // Append the petInfoDiv to the card with display property of none
            $(".animal-cards").append(petCard);
        }
        // Append the shelter information to the animalShelterInformaiton div that sits above the animal cards
        let shelterName = $("<div>").text(shelterArray[shelterCount]["name"]["$t"]).addClass('shelterName');
        let shelterContact = $("<div>").text(petObject[0]["contact"]["email"]["$t"]).addClass('petContact'); // for shelters, the email address is the same, so pick off the email address from the first animal in the array
        $(".animal-shelter-information").append(shelterName, shelterContact);
    } else {
        let noMoreAnimals = `This shelter does not have any ${userSelectedAnimal}s available for adoption, try clicking the Next Shelter button`;
        $(".shelter-contact").append($("<div class='no-more-animals'>").text(noMoreAnimals));
    }
    nextShelterButton = $('<button>', {
        text: 'Next Shelter',
        class: "btn btn-danger btn-lg col-sm-5 col-sm-offset-2 col-xs-8 col-xs-offset-2 shelter-button",
        click: nextShelter
    });
    previousShelterButton = $('<button>', {
        text: 'Previous Shelter',
        class: "btn btn-danger btn-lg col-sm-5 col-sm-offset-0 col-xs-8 col-xs-offset-2 shelter-button",
        click: previousShelter

    });

    $('#pet-info').append(previousShelterButton, nextShelterButton);
}

var shelterArray = [];
var petArray = [];
var shelterCount = 0;
/**
 * @name - shelterFinder - function for finding a shelter based on the user submitted location. Also updates the shelter list
 * @params - none
 * dataObject @type
 */
const shelterFinder = function () {
    let userLocation = $(".user-location").val();
    let dataObject = {
        format: "json",
        key: "579d9f154b80d15e1daee8e8aca5ba7a",
        location: userLocation,
        output: "full",
        count: 5
    };
    // Quick hard coded error handling for empty input fields
    (userLocation.length < 4) ? (dataObject.location = "90210") : (dataObject.location = userLocation);
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
            shelterPets();
            displayMap(); // displayMap really creates the map, and the toggleVisibility is really what makes it visible.
            //suggestion.getItemInformation();
            //suggestion.findNearestStoreFromShelter();
        }
    });
};

function getRandomShelterBasedOnAreaCode() {
    return shelterArray[shelterCount]["id"]["$t"];
}

const shelterPets = function (id = getRandomShelterBasedOnAreaCode(shelterArray)) {
    $.ajax({
        url: 'https://api.petfinder.com/shelter.getPets?key=579d9f154b80d15e1daee8e8aca5ba7a&output=full&format=json&callback=?',
        type: 'GET',
        data: {
            id: id
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

const nextShelter = function () {
    petArray = [];
    nextShelterButton.remove();
    previousShelterButton.remove();
    emptyAnimalDOM(); // Empty the DOM for all information about the animals
    $('.walmart-item').remove(); // Clear all appended Walmart items from the DOM before showing the animals from the next shelter
    $('.walmart-suggestion').css('display', 'inline-block'); // Show the walmart button when they click for next/previous shelter

    if (shelterCount < 4){
        shelterCount++;
    }
    else if(shelterCount >= 4){
        shelterCount = 0;
        let noMoreShelters = $("<a href='index.html' class='btn' class='noMoreShelters btn btn-outline-primary'>").text("No more shelters in your area. New Search?");
        emptyAnimalDOM();
        $(".animal-cards").append(noMoreShelters);
        // $('.noMoreShelters').on('click', resetEverything);
        // return;
    }
    displayMap();
    shelterPets();
};

const previousShelter = function () {
    petArray = [];
    nextShelterButton.remove();
    previousShelterButton.remove();
    emptyAnimalDOM(); // Empty the DOM for all information about the animals
    $('.walmart-item').remove(); // Clear all appended Walmart items from the DOM before showing the animals from the next shelter
    $('.walmart-suggestion').css('display', 'inline-block'); // Show the walmart button when they click for next/previous shelter

    if (shelterCount > 0){
        shelterCount--;
    }
    else if(shelterCount >= 4){
        shelterCount = 0;
        let noMoreShelters = $("<a href='index.html' class='btn' class='noMoreShelters btn btn-outline-primary'>").text("No more shelters in your area. New Search?");
        emptyAnimalDOM();
        $(".animal-cards").append(noMoreShelters);
        // $('.noMoreShelters').on('click', resetEverything);
        // return;
    }
    displayMap();
    shelterPets(shelterArray[shelterCount]["id"]["$t"]);
};

/**
 * @name emptyAnimalDOM - remove all animal cards, shelter information, and notification text from the DOM
 */
const emptyAnimalDOM = function() {
    $('.animal-cards').empty();
    $('.animal-shelter-information').empty();
    $('.no-more-animals').remove();
};

/**
 * @name toggleVisibility - hide and show components based on whether or not the user is searching
 * @param context {type | string}
 */

function toggleVisibility(context) {
    let animalSelection = $('.animal-selection'); // the div containing the form for the user to select an animal
    let map = $('#map');
    let walmartDiv = $('.walmart');
    switch(context) {

        case('animalSearch'):
            animalSelection.css('display','none'); // hide the input form
            map.css('display', 'block'); // make the map visible
            walmartDiv.css('display', 'block'); // make the suggestion button visible
            break;
        case('newSearchRequested'):
            map.css('display','none'); // hide the map
            walmartDiv.css('display', 'none'); // hide the walmart div
            emptyAnimalDOM(); // Clear out animal DOM
            $('.newSearchButton').remove();
            animalSelection.css('display','block');
            break;
        default:
            console.log("toggle visibility default");

    }
}