// jQuery
$(document).ready(function(){
    // console.log('ready..')

    // console.log(global_pdf);
    let sendMapToMobile = function(){
      let destinations = global_pdf.route_stops;
      // if start at MY LOCATION???
      let mobile_start = "comgooglemaps://?saddr=My+Location";
      // else start at 0.
      let mobile_end = "";
      let midpoints = "";
      // console.log(destinations.length);
      for (var i = 0; i < destinations.length; i++){
        // console.log(i)
        // console.log(destinations[i]);
        if (i == destinations.length - 1){
          mobile_end = "&daddr="+destinations[i].lat+","+destinations[i].lng+"";
        } else {
          midpoints += "+to:"+destinations[i].lat+","+destinations[i].lng+"";
        }
      }
      // for each wypt
      //   midpoint+="+to:"+locale
      let href = mobile_start+mobile_end+midpoints+"&views=traffic";
        // window.location("comgooglemaps://?saddr=Austin,TX&daddr=Mason,TX+to:Elgin,TX+to:Temple,TX&views=traffic");

      window.open(href);
      // console.log(global_pdf.route_stops);
      // console.log(href);
    }


    $("#mobileFunc").on('click', function() {
      // console.log('printing....');
      sendMapToMobile();
    });
});
