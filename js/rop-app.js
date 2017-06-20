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

		let openDataLink  = 'https://data.austintexas.gov/resource/icyb-dhz7.json'


		$.ajax({
				url: "https://data.austintexas.gov/resource/icyb-dhz7.json",
				type: "GET",
				data: {
					"$limit" : 90,
					"$$app_token" : "n89g7s9iUyusfWDEHDHMtGcVT"
				}
		}).done(function(data) {

			//prep dataset by sorting & counting data incidents
			var sortedData = _.sortBy(data, 'activitydate');
			var counts = _.countBy(sortedData,'activitydate');

			//1 get total count add add it to the dash-total panel
			$("#full-count").html(data.length);
			//variables for typeChart
			let bscCount=0, citeCount=0, inspectCount=0, novCount=0, warningCount=0, nullCount=0;

			//variables for timelineChart
			//value = count, key = date that was counted
			var timeSeriesData = _.map(counts, function(value, key){
				let _d = new Date(key);
				let yr = _d.getFullYear();
				let mth = _d.getMonth();
				let day = _d.getDate();
				return [ Date.UTC(yr,mth,day),  value	];
			});
				// [Date.UTC(2013,5,9),3],

			// console.log(dataCounted);



			//LOOP THROUGH DATA
			for (let i = 0; i < data.length; i++){
				// console.log(data[i]);


				//2 get type data and add it to the dash-type panel
					//a. get counbt
				switch(data[i].activitytype) {
					case 'BSC Review':
							bscCount = bscCount + 1;
			        break;
			    case 'Citation Issued':
							citeCount = citeCount + 1;
			        break;
			    case 'NOV Sent':
							novCount = novCount + 1;
			        break;
			    case 'Inspection Performed':
							inspectCount = inspectCount + 1;
			        break;
			    case 'Warning Issued':
							warningCount = warningCount + 1;
			        break;
			    default:
			        nullCount = nullCount + 1;
				} //end of switch


				//3. total data for date incidents

			} //end of For Loop

			let activityTypeChart = Highcharts.chart('container-type', {
				chart: {
						type: 'bar'
				},
				title: {
						text: 'Activities by Type'
				},
				xAxis: {
						categories: ['BSC Review','Citation Issued','Inspection Performed','NOV Sent','Warning Issued']
				},
				yAxis: {
						title: {
								text: 'b'
						}
				},
				series: [{
						name: ['Total Count'],
						data: [bscCount, citeCount, inspectCount, novCount, warningCount],
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

			let timelineChart = Highcharts.chart('container-time', {
        // chart: {
        //     zoomType: 'x'
        // },
        title: {
            text: 'Activity Counts Over Time'
        },
        // subtitle: {
        //     text: document.ontouchstart === undefined ?
        //             'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        // },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'a'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: 'Activities',
            data: timeSeriesData
        }]
    });




					//variables for leaflet (geojson)
					var markers = L.markerClusterGroup();

					function onEachFeature(feature, layer) {
					    // does this feature have a property named popupContent?
					    if (feature.properties && feature.properties.popupContent) {
					        layer.bindPopup(feature.properties.popupContent);
					    }
					}

					let geojsonFeature = _.map(data, function(value, key){
						return {
										"type": "Feature",
										"properties": {
												"id": key,
												"name": value.registeredaddress,
												"popupContent": ''+value.registeredaddress+''
										},
										"geometry": value.location_1
//										{
												// "type": "Point",
												// "coordinates": [-104.99404, 39.75621]
	//									}
									}
				});

					// console.log(data);


				/* LEAFLET SECTION!!!*/
				let myMap = L.map('leaflet-map').setView([30.2741121,-97.7521457], 12);
				// https: also suppported.
				let OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				}).addTo(myMap);

				// L.geoJSON(geojsonFeature, {
				//     onEachFeature: onEachFeature
				// }).addTo(mymap);
				let geojsonLayer = L.geoJSON(geojsonFeature, {
				    onEachFeature: onEachFeature
				});
				markers.addLayer(geojsonLayer);
				myMap.addLayer(markers);
				myMap.fitBounds(markers.getBounds());


		}); //end of ajax request
  });
