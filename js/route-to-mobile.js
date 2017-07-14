// jQuery
$(document).ready(function(){
    console.log('ready..')

    console.log(global_pdf);
    let sendMapToMobile = function(){
      let destinations = global_pdf;
      // if start at MY LOCATION???
      let mobile_start = "comgooglemaps://?saddr=My+Location";
      // else start at 0.
      let mobile_end = "&daddr=30.2906777,-97.7411164";
      let midpoints = "";
      // for each wypt
      //   midpoint+="+to:"+locale
      let href = mobile_start+mobile_end+midpoints+"&views=traffic";
        // window.location("comgooglemaps://?saddr=Austin,TX&daddr=Mason,TX+to:Elgin,TX+to:Temple,TX&views=traffic");

      window.open(href);
    }


    $("#mobileFunc").on('click', function() {
      console.log('printing....');
      sendMapToMobile();
    });
});
