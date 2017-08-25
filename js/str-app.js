var map;
$(document).ready(function(){
		let openDataLink  = 'https://data.austintexas.gov/resource/673d-jv2y.json';

		$.ajax({
				url: openDataLink,
				type: "GET",
				data: {
					"$limit" : 2000,
					"$$app_token" : "n89g7s9iUyusfWDEHDHMtGcVT"
				}
		}).done(function(data) {

			let strTypeCount = _.countBy(data,'str_type');
			let zipCodeCount = _.countBy(data,'prop_zip');
			let addressCount = _.countBy(data,'prop_address');

			let strTypeValues = _.values(strTypeCount);
			let strTypeKeys = _.keys(strTypeCount);

			let zipValues = _.values(zipCodeCount);
			let zipKeys = _.keys(zipCodeCount);

			let addressKeys = _.keys(addressCount);

			//1 get total count add add it to the dash-total panel
			$("#full-count").html(data.length);
			//variables for typeChart
			let bscCount=0, citeCount=0, inspectCount=0, novCount=0, warningCount=0, nullCount=0;

			let activityTypeChart = Highcharts.chart('container-type', {
				chart: {
						type: 'bar'
				},
				title: {
						text: 'STRs by Type'
				},
				xAxis: {
						categories: strTypeKeys
				},
				yAxis: {
						title: {
								text: ''
						}
				},
				series: [{
						name: ['Total Count'],
						data: strTypeValues,
						dataLabels: {
	            enabled: true,
	            // color: '#FFFFFF',
	            align: 'right',
	            // format: '{point.y:.1f}', // one decimal
	            // y: 10, // 10 pixels down from the top
	            style: {
	                // fontSize: '10px',
	                // fontFamily: 'Verdana, sans-serif'
	            }
	        }
				}]
			}); //end of myChart
			let zipCountChart = Highcharts.chart('container-zip', {
				chart: {
						type: 'column'
				},
				title: {
						text: 'STRs by Zip Code'
				},
				xAxis: {
						categories: zipKeys
				},
				yAxis: {
						title: {
								text: ''
						}
				},
				series: [{
						name: ['Total Count'],
						data: zipValues,
						dataLabels: {
				            enabled: true,
				            // color: '#FFFFFF',
				            align: 'right',
				            // format: '{point.y:.1f}', // one decimal
				            // y: 10, // 10 pixels down from the top
				            style: {
				                // fontSize: '10px',
				                // fontFamily: 'Verdana, sans-serif'
				            }
				        }
				}]
			}); //end of myChart


			//2. get lat lngs from cleaned addresses
			const API_KEY = 'AIzaSyBbnhwYIXT-MBTVIaDxS9kzbqIOmoeqcRU'
			geocoder = new google.maps.Geocoder();

			//function for adding the marker
			function addMarker(location, popUpText) {

				let cityCircle = new google.maps.Circle({
		            strokeColor: '#FF0000',
		            strokeOpacity: 0.8,
		            strokeWeight: 2,
		            fillColor: '#FF0000',
		            fillOpacity: 0.35,
		            map: map,
		            center: location,
		            radius: 200
		          });
				let infoWindow = new google.maps.InfoWindow({
					content: popUpText
				});

				google.maps.event.addListener(cityCircle, 'click', function(ev) {
		            infoWindow.setPosition(ev.latLng);
		            infoWindow.open(map);
		        });
			}

			/* Google Map SECTION!!!*/
			//1. clean addresses
			// console.log('1');
			let addressCleaned = addressKeys.map(function(elem){
				return elem.substring(9,elem.length).trim() + ", Austin, TX";
			});

			// console.log('starting');
			let i = 0; let secondTry = []; let secondTryKeys = [];
			function addressLoop(){
				geocoder.geocode({
					'address': addressCleaned[i]
				}, function(results, status) {
						// console.log(addressCleaned[i]);
						if (status == google.maps.GeocoderStatus.OK) {
							//if we get a response, map the address
							// console.log(addressCleaned[i]+" "+addressKeys[i]);
							addMarker(results[0].geometry.location, addressKeys[i]);
							if (i < addressCleaned.length){
					    	setTimeout(addressLoop, 500);
								i = i + 1;
							}
						} else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
							//over the limit, so we wait and try again in 2.5 seconds...
								// console.log('pause.... at '+i+' position...');
								// console.log(addressCleaned[i]);
								setTimeout(addressLoop, 2500);
						} else {
							// console.log('err');
						}
				});
		 	}
			addressLoop();

		}); //end of ajax request

		let initialize = function() {
			if (typeof google !== 'object') {
		      //if google is undefined loop back until it is loaded...
		      setTimeout(function() {
		        initialize();
		      }, 1000)
		    }
		    let myLatlng = new google.maps.LatLng(30.2764099,-97.7507724);
		    let mapOptions = {
		      zoom: 13,
		      center: myLatlng,
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    }
		    map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

		    //Resize Function
		    google.maps.event.addDomListener(window, "resize", function() {
		      var center = map.getCenter();
		      google.maps.event.trigger(map, "resize");
		      map.setCenter(center);
		    });
		}
		initialize();

  });
