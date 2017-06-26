$(document).ready(function(){
	/*
	short term:
	1. develop minification process
	2. visual is similar to amanda
	3. load api on init
	4. autocomplete names on typing input
	5. add live map to pinpoint locations on everytime a user adds a new address

	long term:
	1. can we send the final route to a mobile app"
	*/

	//goooglemapsJS
      var map, directionsService, directionsDisplay, geocoder, addressMarkerArray = [], iconCount = 0, activeElement; //global variables
			var labels = '0123456789ABCDEFGHIJKL';
      var initialize = function(){
    			geocoder = new google.maps.Geocoder();
          directionsService = new google.maps.DirectionsService;
          directionsDisplay = new google.maps.DirectionsRenderer;
          var myLatlng = new google.maps.LatLng(30.3344316,-97.6791038);

          var mapOptions = {
            zoom: 14,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          map = new google.maps.Map(document.getElementById('map'), mapOptions);

          //Resize Function
          google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
          });

					// google.maps.event.addListener(map, 'click', function(event) {
	        //   addMarker(event.latLng, map);
	        // });

      }

			function addMarker(location, map) {
				var labelObject;
				if (iconCount == 0){
					labelObject = { color:'black', fontSize: '11px', fontWeight: '700', text: 'START'};
				} else {
					labelObject = { color:'black', fontSize: '11px', fontWeight: '700', text: labels[iconCount % labels.length] };
				}
				// Add the marker at the clicked location, and add the next-available label
				// from the array of alphabetical characters.
				var newMarker = new google.maps.Marker({
					position: location,
					label: labelObject,
					map: map,
					draggable: false
				})
				addressMarkerArray.push(newMarker);
				//attach the lat lng to the element
				if (!$(activeElement).attr('val') ){
					console.log('location added to element')
					$(activeElement).attr('val',location);
				}
				iconCount = iconCount + 1;
				adjustMapBounds();
			}

			var placeAddressOnMap = function(address){
				geocoder.geocode( { 'address': address}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						addMarker(results[0].geometry.location, map);
					} else {
						alert('Geocode was not successful for the following reason: ' + status);
					}
				});
			}

			var adjustMapBounds = function(){
				if (addressMarkerArray.length <= 1){
					//move map to singular point
					map.setCenter(addressMarkerArray[0].getPosition());
				} else {
					 var bounds = new google.maps.LatLngBounds();
			     // showing only 2 visible 1 hidden (because of markers.length-1)
			     for(var i=0; i<addressMarkerArray.length; i++) {
			         // extending bounds to contain this visible marker position
			         bounds.extend( addressMarkerArray[i].getPosition() );
			     }
			     // setting new bounds to visible markers of 2
			     map.fitBounds(bounds);
				}
			}

			var extractLATLNG = function(coords){
				var latitude = Number(coords.split(',')[0].trim().slice(1, coords.length));
				var longitude = Number(coords.split(',')[1].trim().slice(0,-1));
				return { lat: latitude, lng: longitude };
			}

			var updateMarkerOrder = function(map){
				if (map){
					//reorder markers by drawing new markers
          var addressRowSelection = $("#routableAddressRows > tr:not(.placeholder)");
					// first empty the array and clear map
					for(var i=0; i<addressMarkerArray.length; i++) {
						addressMarkerArray[i].setMap(null);
					}
					addressMarkerArray = []; iconCount = 0;

					addressRowSelection.each(function(elem){
						var latLngObj = extractLATLNG($(this).children("td#location").attr('val'));
						addMarker( latLngObj, map )
						// newMarkerLocations.push( $(this).children("td#location").attr('val') );
					});
				} else {
					for(var i=0; i<addressMarkerArray.length; i++) {
						addressMarkerArray[i].setMap(null);
					}
				}
			}


			var removeSpecificMarker = function(rowIndex){
				iconCount = iconCount - 1;
				addressMarkerArray[rowIndex].setMap(null);
				addressMarkerArray.splice(rowIndex, 1);
			}

      var calculateAndDisplayRoute = function() {
					//clear existing points
					updateMarkerOrder(null);
					addressMarkerArray = [];

          directionsDisplay.setMap(map);
          var waypts = [], start = '', finish = '', caseArray = [];
          // grab addresses from elements
          var addressRowSelection = $("#routableAddressRows > tr:not(.placeholder)");
					console.log(addressRowSelection);
          var summaryPanel = document.getElementById('directions-panel');
          summaryPanel.innerHTML = '';
          //loop through list and sort into waypoints, start, and last
          addressRowSelection.each(function(i){
            //grab text and trim whitespace
						// console.log()
          	var latLngObj = extractLATLNG($(this).children("td#location").attr('val'));
						caseArray.push( $(this).children("td").eq(2).text() );

            //if it's #1 it's start location, if it's last it's finish, else it's waypoint
            if (i == 0){
              start = new google.maps.LatLng(latLngObj.lat, latLngObj.lng);
            } else if (i == (addressRowSelection.length - 1) ){
              finish = new google.maps.LatLng(latLngObj.lat, latLngObj.lng);
            } else {
              waypts.push({
                location: new google.maps.LatLng(latLngObj.lat, latLngObj.lng),
                stopover: true
              });
            }
          });
          //google's direction service
          directionsService.route({
              origin: start, //document.getElementById('start').value,
              destination: finish, //document.getElementById('end').value,
              waypoints: waypts,
              optimizeWaypoints: true,
              travelMode: 'DRIVING'
            }, function(response, status) {
              if (status === 'OK') {
                //if we get an OK response, add the directions, and show the appropriate elements
                console.log('driving directions complete!!!!')
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                // For each route, display summary information.
                for (var i = 0; i < route.legs.length; i++) {
                  var routeSegment = i + 1;
                  summaryPanel.innerHTML += '<b>Trip #'+routeSegment + ': '+ caseArray[i] +'</b><br>';
                  summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                  summaryPanel.innerHTML += route.legs[i].end_address + '<br>Distance: ';
                  summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
                }
              } else {
                window.alert('Directions request failed due to ' + status);
                summaryPanel.innerHTML = '';
              }
            });

        }
      //function to ensure the remove button works after being moved in DOM
      var validateRemoveButton = function(){
        $(".removeAddress").unbind('click').bind('click', function(){
					console.log('cccclickkk');
					//remove marker
					// var rowIndex = $(this)
					// 		    .closest('tr') // Get the closest tr parent element
					// 		    .prevAll() // Find all sibling elements in front of it
					// 		    .length; // Get their count
					var rowIndex = $(this).parents("tr:first")[0].rowIndex;
					//remove row entry
					removeSpecificMarker(rowIndex-1);
          $(this).parent().parent().remove();
          adjustRowCount();
					//everytime we update the order of our rows, we should
					updateMarkerOrder(map);
        });
      }
      //function to take the address from input and add it too routing list
      var addAddressFromInput = function(address){
				$("#routableAddressRows").append('<tr>'+
									'<td class="first"><span id="count"></span>'+
			              '<button type="button" class="btn btn-sm btn-default removeAddress">'+
			                '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>'+
			              '</button>----</td>'+
									'<td class="b">temp</td>'+
									'<td class="b">n/a</td>'+
									'<td class="c">n/a</td>'+
									'<td class="a">----</td>'+
									'<td class="a">----</td>'+
									'<td class="a">----</td>'+
									'<td class="a">----</td>'+
									'<td class="c">----</td>'+
									'<td class="c" id="location">'+address+'</td>'+
					'</tr>');
				activeElement = $("#routableAddressRows > tr:not(.placeholder):last-child").children("td#location");
				console.log(activeElement);
        validateRemoveButton();
        adjustRowCount();
				placeAddressOnMap(address);
      }
      //everytime the DOM is updated, adjust list count
      var adjustRowCount = function(){
				//check for placeholder rows (this is a bug fix essentially...)
				$("#routableAddressRows > tr.placeholder").remove()

        var divGroup = $("#routableAddressRows > tr");
        var arrayLength = $("#routableAddressRows > tr:not(.placeholder) ").length;

        // disable or enable route button based on number of addresses available
        if (arrayLength >= 2){
          $("#createRoute").prop('disabled', false);
          $("#createRoute").addClass('btn-primary');
          $("#createRoute").removeClass('btn-default');
        } else {
          $("#createRoute").prop('disabled', true);
          $("#createRoute").removeClass('btn-primary');
          $("#createRoute").addClass('btn-default');
        }

				//adjust list CSS #s
        divGroup.each(function(i){
					if (i == 0){
          	$(this).children("td").find("span#count").html('S');
					} else {
          	$(this).children("td").find("span#count").html(i);
					}
        });

				//we always want at least 10 rows (placeholders or real rows)
				addPlaceholderRows(arrayLength);
      }
			var addPlaceholderRows = function(rowCount){
				//we always want at least 10 rows (placeholders or real rows)
				for (var i = rowCount; i < 10; i++){
					var newRow = '<tr class="placeholder">';
					for (var j = 0; j< 10;j++){
						newRow += '<td id="no">&nbsp;</td>';
					}
					newRow +='</tr>';
					$("#routableAddressRows").append(newRow);
					newRow = '';
				}
			}


      //dragulaJS provides for the drag and drop functionality
      dragula([document.getElementById("availableAddressRows"), document.getElementById("routableAddressRows")],
        {
          copy: function (el, source) {
            return source === document.getElementById("availableAddressRows")
          },
          accepts: function (el, target) {
            return target !== document.getElementById("availableAddressRows")
          },
          removeOnSpill:  false
      }).on('drop', function (el, target, sibling) {

				 if (target){
          if ( $(el).children("td").children("button").length ){
            // console.log('button');
            //if it already has a button skip, we need to sort the address rows
						updateMarkerOrder(map);
          } else {
            $(el).children("td.first").prepend(''+'<span id="count"></span>'+
              '<button type="button" class="btn btn-sm btn-default removeAddress">'+
                '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>'+
              '</button>');
							//extract a readable text
							var newAddress = $(el).children("td#location").text().trim() + ", Austin, TX";;
							//get the element so we can add latlngs to it later
							activeElement = $(el).children("td#location");
							placeAddressOnMap(newAddress);
          }

          validateRemoveButton();
          adjustRowCount();
				} else {
					console.log('missed');
				}
      }).on('drag', function (el) {
				//adding class to dragging func
				$(el).css('font-size','11px');
				$(el).css('background-color','white');
				$(el).css('border','1px #ddd solid');
				$(el).children().css('width','10%');
			}).on('remove', function (el) {
				console.log('item removed...');
        adjustRowCount();
				//TO DO - remove from map as well
      });

      $("#dropdownChoice > li").on('click', function(){
        var addressValue = $(this).attr('val');
        addAddressFromInput(addressValue);
      });

      $("#addNewAddress").on('click', function(){
          if ( $("#addressInput").val().length >= 5 ){
            var addressValue = $("#addressInput").val();
            addAddressFromInput(addressValue);
            $("#addressInput").val('');
          }
      });
      $(document).keypress(function(e) {
          //if user presses enter while focused on input field
          if(e.which == 13 && $("#addressInput:focus").val()) {
                //if input value has contents greater than 5
                if ( $("#addressInput:focus").val().length >= 5 ){
                  //trigger addNewAddress click event
                  $( "#addNewAddress" ).trigger( "click" );
                }
          }
      });

      $("#resetList").on('click', function(){
				//clear available task list items

	      $("#availableAddressRows").html("");
				$("#directions-panel").html("");
				//clear routable addresses
        var divGroup = $("#routableAddressRows > tr:not(.placeholder)");
        divGroup.each(function(i){
          $(this).remove()
        });
        adjustRowCount();
				//remove markers from map
				updateMarkerOrder(null);
				addressMarkerArray = [];
				iconCount = 0;
      });

      $("#createRoute").on('click', function(){
        $("#loading-overlay").fadeIn( "fast" );
				calculateAndDisplayRoute();
      });

			//on load run these functions:

			addPlaceholderRows(0);
			initialize();
  });
