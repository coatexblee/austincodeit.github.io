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
      var map, directionsService, directionsDisplay; //global variables
      var initialize = function(){
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
      }

      var calculateAndDisplayRoute = function() {
          directionsDisplay.setMap(map);
          var waypts = [], start = '', finish = '';
          // grab addresses from elements
          var divGroup = $("#toBeRouted > div.list-group h4");

          var summaryPanel = document.getElementById('directions-panel');
          summaryPanel.innerHTML = '';
          //loop through list and sort into waypoints, start, and last
          divGroup.each(function(i){
            //grab text and trim whitespace
            var loc = $(this).text().trim();
            //if it's #1 it's start location, if it's last it's finish, else it's waypoint
            if (i == 0){
              start = loc;
            } else if (i == (divGroup.length - 1) ){
              finish = loc;
            } else {
              waypts.push({
                location: loc,
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
                $("#loading-overlay").fadeOut( "slow" );
                $("#directions-panel").fadeIn( "slow" );
                var route = response.routes[0];
                // For each route, display summary information.
                for (var i = 0; i < route.legs.length; i++) {
                  var routeSegment = i + 1;
                  summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                      '</b> - Case #23-1231515<br>';
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
        $(".removeAddress").on('click', function(){
          $(this).parent().parent().remove();
          adjustRowCount();
        });
      }
      //function to take the address from input and add it too routing list
      var addAddressFromInput = function(address){
        console.log(address);
        $("#toBeRouted").append('<div class="list-group">'+
            '<a class="list-group-item ">'+
              '<h4 class="list-group-item-heading">'+ address +
                '<button type="button" class="btn btn-sm btn-default removeAddress">'+
                  '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>'+
                '</button>'+
              '</h4>'+
              '<table classs="table table-condensed">'+
                '<tr>'+
                  '<th>...added by User</th>'+
                '</tr>'+
              '</table>'+
            '</a>'+
          '</div>');
        validateRemoveButton();
        adjustRowCount();
      }
      //everytime the DOM is updated, adjust list count
      var adjustRowCount = function(){
        var divGroup = $("#routableAddressRows > tr");
        var arrayLength = $("#routableAddressRows > tr ").length;
        //adjust list CSS #s
        divGroup.each(function(i){
          $(this).children("td").find("span#count").html(i+1);
        });
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
          removeOnSpill:  function (el, source) {
            return source === document.getElementById("routableAddressRows")
          }
      }).on('drop', function (el) {

          if ( $(el).children("td").children("button").length ){
            // console.log('button');
            //if it already has a button skip, else..
          } else {
            $(el).children("td.first").append(''+'<span id="count"></span>'+
              '<button type="button" class="btn btn-sm btn-default removeAddress">'+
                '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>'+
              '</button>');
          }
          validateRemoveButton();
          adjustRowCount();
      }).on('drag', function (el) {
				//adding class to dragging func
				$(el).css('font-size','11px');
				$(el).css('background-color','white');
				$(el).css('border','1px #ddd solid');
				$(el).children().css('width','10%');
			}).on('remove', function (el) {
          adjustRowCount();
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
        var divGroup = $("#toBeRouted > div.list-group ");
        divGroup.each(function(i){
          $(this).remove()
        });
        adjustRowCount();
      });

      $("#createRoute").on('click', function(){
        $("#loading-overlay").fadeIn( "fast" );
        $( "#mapResults" ).slideToggle( "slow", function() {
          initialize();
          // Animation complete.
          calculateAndDisplayRoute();
        });
        $( "#firstRow" ).slideToggle( "slow", function() {
          //hide menu options
        });
      });

      $("#resetApp").on('click', function(){
        $("#resetList").trigger( "click" );
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '';
        $( "#mapResults" ).slideToggle( "slow", function() {
          // Animation complete.
        });
        $( "#firstRow" ).slideToggle( "slow", function() {
          //
        });
      })

      // setTimeout(function(){
      //   alert('This is a draft prototype. The functions and data used are samples only.');
      //   }, 1000);
  });
