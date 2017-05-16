$(document).ready(function(){

  var sampleArray = [1,2,3,'A','GH','X',343,'...'];
  $("#loadTaskList").on('click', function(){

      if ( $("#inspectorID").val().length >= 2 ){
        var addressValue = $("#inspectorID").val();
        //getAddresswaFromID(addressValue);
        $("#inspectorID").val('');
      }
      //loop through results and get addresses
      $(sampleArray).each(function(i){
        $("#availableAddresses").append(`<div class="list-group">
            <a href="#" class="list-group-item ">
              <h4 class="list-group-item-heading"> Sample Address #`+sampleArray[i]+`</h4>
              <p class="list-group-item-text">... <span style="padding-left:2em"></span>|<span style="padding-left:2em"></span> ... <span style="padding-left:2em"></span>|<span style="padding-left:2em"></span> ... <span style="padding-left:2em"></span>|<span style="padding-left:2em"></span> ... <br>

              </p>
              <p><b>Case #</b>???-??-??</p>

            </a>
          </div>
          `);
      });

  });

});
