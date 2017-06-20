$(document).ready(function(){

		let openDataLink  = 'https://data.austintexas.gov/resource/673d-jv2y.json';

		$.ajax({
				url: openDataLink,
				type: "GET",
				data: {
					"$limit" : 90,
					"$$app_token" : "n89g7s9iUyusfWDEHDHMtGcVT"
				}
		}).done(function(data) {

			console.log(data);
			let strTypeCount = _.countBy(data,'str_type');
			let zipCodeCount = _.countBy(data,'prop_zip');

			let strTypeValues = _.values(strTypeCount);
			let strTypeKeys = _.keys(strTypeCount);

			let zipValues = _.values(zipCodeCount);
			let zipKeys = _.keys(zipCodeCount);

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



		}); //end of ajax request
  });
