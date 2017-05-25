// $(document).ready(function(){
//     shelterFinder();
// });
//
// function getRandomPet() {
//     var dataObject = {
//         format: "json",
//         key: "1db51d3f16936ba505cf7a0476dd8771",
//         animal: "dog",
//         output: "basic"
//         //callback: "\?"
//     };
//     var urlString = "http://api.petfinder.com/pet.getRandom?format=json" + "&" + dataObject["animal"] + "&" + dataObject["output"] + "&" + "callback=?";
//     $.ajax({
//         data: dataObject,
//         dataType: "JSON",
//         method: "GET",
//         url: urlString, //"http://api.petfinder.com/pet.getRandom", // petFinder.php",
//         success: function(response) {
//             console.log(response["petfinder"]["pet"]);
//         },
//         error: function(response) {
//             console.log(response);
//         }
//     });
// }
// //http://api.petfinder.com/pet.getRandom?key=1db51d3f16936ba505cf7a0476dd8771&animal=dog&output=basic
//
// var shelterArray = [];
// var shelterFinder = function () {
//     $.ajax({
//         url: 'http://api.petfinder.com/shelter.find?key=579d9f154b80d15e1daee8e8aca5ba7a&output=full&format=json&callback=?',
//         type: 'GET',
//         data: {
//             location: 92705
//         },
//         dataType: 'json',
//         success: function (result) {
//             console.log(result);
//             for(var i = 0; i < result.petfinder.shelters.shelter.length; i++) {
//                 shelterArray.push(result.petfinder.shelters.shelter[i])
//             }
//         }
//     });
// };
// function createMap(obj){
//     $("#map").googleMap({
//         zoom: 14,
//         coords: [obj.coordinates[0],obj.coordinates[1]] // Map center (optional)
//     });
//     $("#map").addMarker({
//         coords: [obj.coordinates[0].obj.coordinates[1]],
//         title: obj.address.name,
//         text: obj.address.text
//     });
// }
// function infoForMap(){
//     var index = 1;
//     var coordObj = {};
//     coordObj.address = {};
//     coordObj.coordinates = [parseFloat(shelterArray[index].latitude['$t']),parseFloat(shelterArray[index].longitude['$t'])];
//     coordObj.address.name = shelterArray[index].name['$t'];
//     coordObj.address.city = shelterArray[index].city['$t'];
//     coordObj.address.state = shelterArray[index].state['$t'];
//     coordObj.address.text = coordObj.address.city + ', ' + coordObj.address.state;
//     return coordObj;
// }
//
// function displayMap(){
//     var coordinates = infoForMap();
//     createMap(coordinates);
// }
// //index track in the array
// //shelter list, shelter index = #, points at the index number
