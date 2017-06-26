$(document).ready(function(){

  let openDataLink  = 'https://data.austintexas.gov/resource/x6vs-siqw.json';
  let openData;
  $.ajax({
      url: openDataLink,
      type: "GET",
      data: {
        "$limit" : 90,
        "$$app_token" : "n89g7s9iUyusfWDEHDHMtGcVT"
      }
  }).done(function(data) {

    			//get unique inspector names
    			var nameArray = _.chain(data).pluck('assigneduser').uniq().value();
          //set up autocomplete w jquery ui plugin
          $( "#inspectorID" ).autocomplete({
            source: nameArray
          });
          //assign object to higher variable for search purposes...
          openData = data;
  });
  function dateFormatting(datestring){
    let _d = new Date(datestring);
    let yr = _d.getFullYear();
    let mth = _d.getMonth();
    let day = _d.getDate();
    if (isNaN(yr)){
      return '';
    } else {
      return mth + "/" + day + "/" + yr;
    }
  }
  function nullCheck(string){
    if (string){
      return string;
    } else {
      return '';
    }
  }
  $("#loadTaskList").on('click', function(){
      //clear current list-group
      $("#availableAddressRows").html("");
      //grab inspectorID
      let chosenName = $("#inspectorID").val();
      if ( $("#inspectorID").val().length >= 2 ){
        // var inspectorValue = $("#inspectorID").val();
        //getAddressesFromID(inspectorValue);
        $("#inspectorID").val('');
      }
      let filteredData = _.filter(openData, function(row){
          return row.assigneduser == chosenName;
      })
      //loop through results and append data
      $(filteredData).each(function(i){

        $("#availableAddressRows").append('<tr>'+
                  '<td class="first">'+nullCheck(filteredData[i].type) +'</td>'+
                  '<td class="b">'+nullCheck(filteredData[i].subtype) +'</td>'+
                  '<td class="b">'+nullCheck(filteredData[i].foldernumber) +'</td>'+
                  '<td class="c" id="location">'+nullCheck(filteredData[i].foldername) +'</td>'+
                  '<td class="a">'+nullCheck(filteredData[i].priority1) +'</td>'+
                  '<td class="a">'+nullCheck(filteredData[i].priority2) +'</td>'+
                  '<td class="a">'+dateFormatting(filteredData[i].duetostart) +'</td>'+
                  '<td class="a">'+dateFormatting(filteredData[i].duetoend) +'</td>'+
                  '<td class="c">'+nullCheck(filteredData[i].peoplename) +'</td>'+
                  '<td class="c">'+ nullCheck(filteredData[i].housenumber) +' '+ nullCheck(filteredData[i].streetname) +'</td>'+
          '</tr>');

      });


  });
  $(document).keypress(function(e) {
      //if user presses enter while focused on input field
      if(e.which == 13 && $("#inspectorID:focus").val()) {
            //if input value has contents greater than 5
            if ( $("#inspectorID:focus").val().length >= 2 ){
              //trigger addNewAddress click event
              $( "#loadTaskList" ).trigger( "click" );
            }
      }
  });

});
