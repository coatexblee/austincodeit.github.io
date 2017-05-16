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
              <p class="list-group-item-text">...</p>
              <button type="button" class="btn btn-sm btn-danger removeAddress">
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              </button>
            </a>
          </div>
          `);
      });

  });

});
