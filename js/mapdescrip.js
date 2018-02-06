let defaultmap = $('#mapchoice :selected').val();
$('#mapabout').load('data/textfiles/' + defaultmap + 'NEW.txt');

$('#mapchoice').change(function(){ ;
	let selectedmap = $(this).val();
	$('#mapabout').load('data/textfiles/' +  selectedmap + 'NEW.txt');
	
});   