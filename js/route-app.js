$(document).ready(function(){
      $("#mapResults").hide();
      //goooglemapsJS
      var map, directionsService, directionsDisplay;
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
          //Callout Content
          // var contentString = 'RLC Building';
          // //Set window width + content
          // var infowindow = new google.maps.InfoWindow({
          //   content: contentString,
          //   maxWidth: 500
          // });

          // //Add Marker
          // var marker = new google.maps.Marker({
          //   position: myLatlng,
          //   map: map,
          //   title: 'image title'
          // });
          //
          // google.maps.event.addListener(marker, 'click', function() {
          //   infowindow.open(map,marker);
          // });

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
        divGroup.each(function(i){
          //grab text and trim whitespace
          var loc = $(this).text().trim();
          //loop through if it's #1 it's start location, if it's last it's finish, else it's waypoint
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


        directionsService.route({
            origin: start, //document.getElementById('start').value,
            destination: finish, //document.getElementById('end').value,
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
          }, function(response, status) {
            if (status === 'OK') {
              console.log('driving directions complete!!!!')
              $("#loading-overlay").fadeOut( "slow" );
              directionsDisplay.setDirections(response);
              var route = response.routes[0];
              var summaryPanel = document.getElementById('directions-panel');
              summaryPanel.innerHTML = '';
              // For each route, display summary information.
              for (var i = 0; i < route.legs.length; i++) {
                var routeSegment = i + 1;
                summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                    '</b><br>';
                summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
              }
            } else {
              window.alert('Directions request failed due to ' + status);
              summaryPanel.innerHTML = '';
            }
          });

        }

      var validateRemoveButton = function(){
        $(".removeAddress").on('click', function(){
          $(this).parent().parent().parent().remove();
          adjustRowCount();
        });
      }
      var addAddressFromInput = function(address){
        console.log(address);
        $("#toBeRouted").append(`<div class="list-group">
            <a class="list-group-item ">
              <h4 class="list-group-item-heading">`+ address +`
                <button type="button" class="btn btn-sm btn-default removeAddress">
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button>
              </h4>
              <table classs="table table-condensed">
                <tr>
                  <th>...</th>
                </tr>
              </table>
            </a>
          </div>
          `);
        validateRemoveButton();
        adjustRowCount();
      }
      var adjustRowCount = function(){
        var divGroup = $("#toBeRouted > div.list-group ");
        var arrayLength = $("#toBeRouted > div.list-group ").length;
        divGroup.each(function(i){
          $(this).attr('data-content',i+1);
        })

      }

      dragula([document.getElementById("availableAddresses"), document.getElementById("toBeRouted")],
        {
          copy: function (el, source) {
            return source === document.getElementById("availableAddresses")
          },
          accepts: function (el, target) {
            return target !== document.getElementById("availableAddresses")
          },
          removeOnSpill:  function (el, source) {
            return source === document.getElementById("toBeRouted")
          }
      }).on('drop', function (el) {
          if ( $(el).children(".list-group-item").children("h4").children("button").length ){
            // console.log('button');
            //if it already has a button skip, else..
          } else {
            $(el).children(".list-group-item").children("h4").append(`<button type="button" class="btn btn-sm btn-default removeAddress">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </button>`);
          }
          validateRemoveButton();
          adjustRowCount();
      }).on('remove', function (el) {
          adjustRowCount();
      });

      $("#dropdownChoice > li").on('click', function(){
        var addressValue = $(this).attr('val');
        addAddressFromInput(addressValue);
      });

      $("#addNewAddress").on('click', function(){
          if ( $("#addressInput").val().length >= 2 ){
            var addressValue = $("#addressInput").val();
            addAddressFromInput(addressValue);
            $("#addressInput").val('');
          }
      });
      $(document).keypress(function(e) {
          //if user pressed enter
          if(e.which == 13) {
                //if input value has contents greater than 5
                if ( $("#addressInput").val().length >= 5 ){
                  //trigger addNewAddress click event
                  $( "#addNewAddress" ).trigger( "click" );
                }
          }
      });

      $("#resetMap").on('click', function(){
        var divGroup = $("#toBeRouted > div.list-group ");
        divGroup.each(function(i){
          $(this).remove()
        })
      });

      $("#createRoute").on('click', function(){
        $( "#mapResults" ).slideToggle( "slow", function() {
          $("#loading-overlay").fadeIn( "slow" );
          initialize();
          // Animation complete.
          calculateAndDisplayRoute();
        });
        $( "#firstRow" ).slideToggle( "slow", function() {
          //hide menu options
        });
      });

      $("#resetApp").on('click', function(){
        $("#resetMap").trigger( "click" );
        $( "#mapResults" ).slideToggle( "slow", function() {

          // Animation complete.

        });
        $( "#firstRow" ).slideToggle( "slow", function() {
          //
        });
      })


  });
