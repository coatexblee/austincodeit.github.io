
$(document).ready(function() {

  var createFinalPDF = function(){
      var element = $('#map');
      var pdfOptions = {
          orientation: "landscape", // One of "portrait" or "landscape" (or shortcuts "p" (Default), "l")
          unit: "mm",              //Measurement unit to be used when coordinates are specified. One of "pt" (points), "mm" (Default), "cm", "in"
          format: "letter"            //One of 'a3', 'a4' (Default),'a5' ,'letter' ,'legal'
      };

      var pdf = new jsPDF(pdfOptions);

      var pageWidth = pdf.internal.pageSize.width-20;
      var width  =  pageWidth;

      html2canvas(element, {
          useCORS: true, // MUST
          onrendered: function(canvas) {
              var imgWidth = element.width();
              var imgHeight = element.height();

              var height =  (pageWidth * imgHeight)/ imgWidth
              var imgData = canvas.toDataURL(
                      'image/png');
              pdf.addImage(imgData, 'PNG', 10, 10 , width/1.5 , height/1.5 );
              pdf.save('new.pdf');
          }
      });
}
  // var createFinalPDF = function(){
  //     var doc = new jsPDF({
  //       orientation: 'landscape',
  //       unit: 'in',
  //       format: [11, 8.5]
  //     });
  //     // doc.text('Hello world!', 1, 1)
  //     // doc.save('two-by-four.pdf')
  //
  //
  //     // We'll make our own renderer to skip this editor
  //     var specialElementHandlers = {
  //     	'#editor': function(element, renderer){
  //     		return true;
  //     	}
  //     };
  //
  //     // All units are in the set measurement for the document
  //     // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
  //     doc.fromHTML($('body').get(0), 15, 15, {
  //     	'width': 170,
  //     	'elementHandlers': specialElementHandlers
  //     });
  // }

  $("#createPDF").on('click', function(){
    console.log('printing....');
      createFinalPDF();
  });


});
