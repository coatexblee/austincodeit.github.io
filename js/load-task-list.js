$(document).ready(function(){

  var sampleArray = [
    { address: '2411 Shelby Oak Lane', process: 'Event Log', status: 'Open', fp: '1', pp:'15', start: 'May 1, 2017', comment:'3-1-2017 NEED TO WRITE TICKET'},
    { address: '7510 Islander Dr', process: 'Initial Response/Site Investigation', status: 'Open', fp: '1', pp:'5', start: 'May 8, 2017', comment:'Warning Issued on November 8 2016'},
    { address: '8300 Cayuga Dr', process: 'Initial Response/Site Investigation', status: 'Open', fp: '1', pp:'155', start: 'May 2, 2017', comment:'4-14-2017 NOV for junk at curb'},
    { address: '9207 Kempler Dr', process: 'Event Log', status: 'Open', fp: '', pp:'1', start: 'May 10, 2017', comment:'4-25-2017 NOV for bamboo'},
    { address: '8200 Cache Dr', process: 'Cutlist - Inspector (ROW)', status: 'Submitted to Cutlist', fp: '', pp:'555', start: 'May 17, 2017', comment:'2-23-2017 Need to write an Admin Warning ticket'},
    { address: '3004 Siskin Dr', process: 'Initial Response/Site Investigation', status: 'Open', fp: '', pp:'555', start: 'May 5, 2017', comment:'2-17-2017 Last inspection/ NO show at court'},
    { address: '8611 Leo St', process: 'Event Log', status: 'Open', fp: '', pp:'999', start: 'May 9, 2017', comment:'3-1-2017 NEED TO WRITE TICKET'},
    { address: '6605 WolfCreek Pass', process: 'Event Log', status: 'Open', fp: '', pp: '999', start: 'May 21, 2017', comment:'3-1-2017 NEED TO WRITE TICKET'}
  ];
  $("#loadTaskList").on('click', function(){
      //clear current list-group
      $("#availableAddresses").html("");
      //grab inspectorID
      if ( $("#inspectorID").val().length >= 2 ){
        // var inspectorValue = $("#inspectorID").val();
        //getAddressesFromID(inspectorValue);
        $("#inspectorID").val('');
      }
      //loop through results and get addresses
      $(sampleArray).each(function(i){
        $("#availableAddresses").append('<div class="list-group">'+
            '<a class="list-group-item ">'+
              '<h4 class="list-group-item-heading">'+sampleArray[i].address +'</h4>'+
              '<table class="table table-condensed">'+
                '<tr>'+
                  '<th>Process</th>'+
                  '<td>'+sampleArray[i].process +'</td>'+
                  '<th>F.P.</th>'+
                  '<td>'+sampleArray[i].fp +'</td>'+
                '</tr>'+
                '<tr>'+
                  '<th>Start</th>'+
                  '<td>'+sampleArray[i].start +'</td>'+
                  '<th>P.P.</th>'+
                  '<td>'+sampleArray[i].pp +'</td>'+
                '</tr>'+
                '<tr>'+
                  '<th>Comment</th>'+
                  '<td colspan="3">'+sampleArray[i].comment +'</td>'+
                '</tr>'+
              '</table>'+
            '</a>'+
          '</div>');
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
