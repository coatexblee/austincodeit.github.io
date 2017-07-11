
$(document).ready(function() {
  //////testing block
  // global_pdf = {
  //   datestamp:'2',
  //   timestamp:'2',
  //   start:'2',
  //   end:'2',
  //   name:'2',
  //   time:'2',
  //   tasks:[{
  //     folder:'1',
  //     folder_num:'1',
  //     people:'1',
  //     fp:'1',
  //     pp:'1',
  //     leg_time:'1',
  //     leg_dist:'1'
  //   },{  folder:'1',  folder_num:'1',  people:'1',  fp:'1',  pp:'1',  leg_time:'1',  leg_dist:'1'},
  //   {  folder:'1',  folder_num:'1',  people:'1',  fp:'1',  pp:'1',  leg_time:'1',  leg_dist:'1'},
  //   {  folder:'1',  folder_num:'1',  people:'1',  fp:'1',  pp:'1',  leg_time:'1',  leg_dist:'1'},
  //   {  folder:'1',  folder_num:'1',  people:'1',  fp:'1',  pp:'1',  leg_time:'1',  leg_dist:'1'},
  //   {  folder:'1',  folder_num:'1',  people:'1',  fp:'1',  pp:'1',  leg_time:'1',  leg_dist:'1'},
  //   {  folder:'1',  folder_num:'1',  people:'1',  fp:'1',  pp:'1',  leg_time:'1',  leg_dist:'1'},
  //   {  folder:'1',  folder_num:'1',  people:'1',  fp:'1',  pp:'1',  leg_time:'1',  leg_dist:'1'}
  // ],
  //   trip_dist:'2',
  //   trip_time:'4',
  //   map_center:''
  // };

  var createFinalPDF = function(){
    console.log('creating...')
      var element = $('#directions-panel')[0];
      var pdfOptions = {
          orientation: "portrait", // One of "portrait" or "landscape" (or shortcuts "p" (Default), "l")
          unit: "mm",              //Measurement unit to be used when coordinates are specified. One of "pt" (points), "mm" (Default), "cm", "in"
          format: "letter"            //One of 'a3', 'a4' (Default),'a5' ,'letter' ,'legal'
      };

      var pdf = new jsPDF(pdfOptions);
      /*formatting*/
      pdf.setFont("helvetica");
      pdf.setLineWidth(0.5);
      var left_margin = 16;
      var page_height = 280;
      var page_width = 200;
      var content_margin = 40;
      var page_count = 1;
      var getRightMargin = function(obj){
        return page_width - (obj.length*2)-1;
      }

      var addHeader = function(){
        /* setting up the header */
        pdf.setFontSize(14);
        pdf.text(left_margin, 20, global_pdf.name); //inspector name
        pdf.setFontSize(10);
        pdf.text(left_margin, 27, 'Route: ' + global_pdf.start + ' to '+global_pdf.end ); //route address
        pdf.text(getRightMargin(global_pdf.datestamp),20, ""+global_pdf.datestamp ); //today's date
        pdf.text(getRightMargin(global_pdf.timestamp),27, ""+global_pdf.timestamp ); //timestamp
        // console.log(global_pdf.date.length)
        pdf.line(left_margin, 30, page_width, 30); // horizontal line
        //code logo from url file
        //url, type, x, y, imageHeight, imageWidth
        pdf.addImage(codeImgURL, 'JPEG', page_width/2, 5, 18, 18);
      }
      addHeader();
      //add official footer
      var addFooter = function(){
        pdf.setFontSize(8);
        pdf.setTextColor(70,70,70);
        var footerText = 'City of Austin | Open Data Portal | jsPDF | GitHub'
        var footerMargin = page_width/2 - 20;
        var footerHeight = page_height - 18;
        pdf.text(footerMargin, footerHeight, footerText);
        //add page number
        pdf.text(page_width, footerHeight, String(page_count) );
        //reset text attributes
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
      }
      addFooter();

      //add map to document
      var createMarkerArray = function(markerArray){
        var finalString ='';
        for (var i = 0; i < markerArray.length; i++){
            if(i ==0){
              finalString+="&markers=color:red%7Clabel:S%7C"+String(markerArray[i].lat)+","+String(markerArray[i].lng);
            } else {
              finalString+="&markers=color:red%7Clabel:"+i+"%7C"+String(markerArray[i].lat)+","+String(markerArray[i].lng);
            }
        }
        return finalString
      }

      var element = $('#sampleImg');

      var mapElement = $('#map');
      var google_1 = "https://maps.googleapis.com/maps/api/staticmap";
      var google_2 = "?center="+global_pdf.map_center;
      var google_3 = "&zoom="+global_pdf.map_zoom;
      var google_4 = "&size=700x400";
      var google_5 = createMarkerArray(global_pdf.route_stops);
      var google_6 = "&path=weight:4%7Ccolor:blue%7Cenc:"+global_pdf.route_path;
      var google_k = "&key=AIzaSyCSjAnT5cJ03MwURghAT1nZrLz4InNRpP0";

      // var imgRatio = (page_width-left_margin)/700;
      // var mapImgWidth = element.width()*imgRatio;
      // var mapImgHeight = element.height()*imgRatio;
      var mapImgWidth = 184;
      var mapImgHeight = 105;
      var picMarginX = 10+page_width/2;
      var picMarginY = content_margin-10;

      $(element).attr("src",google_1+google_2+google_3+google_4+google_5+google_6+"&maptype=roadmap"+google_k);

      function addGoogleMapImage(){
        html2canvas(element, {
           useCORS: true,
           onrendered: function(canvas) {
             console.log('rendered...')
             var dataUrl= canvas.toDataURL("image/png");

             pdf.addImage(dataUrl, 'JPEG', left_margin, content_margin-5, mapImgWidth, mapImgHeight);
             pdf.text(left_margin, content_margin+mapImgHeight+20,'Trip Time: '+global_pdf.trip_time+" minutes"); //final row
             pdf.text(left_margin+80, content_margin+mapImgHeight+20,'Trip Distance: '+global_pdf.trip_dist+" miles"); //final row
            //  pdf.output('datauri');
             pdf.addPage();
             page_count = page_count + 1;

             addTaskContents();
           }
       });
      }
      addGoogleMapImage();

      function addTaskContents(){
        addHeader();
        addFooter();
        pdf.setFontType("normal");
        /* setting up task contents*/
        var tasklist = global_pdf.tasks;
        var inner_margin_A = left_margin+10;

        for (var i =0; i < global_pdf.tasks.length;i++){

          pdf.setLineWidth(0.5);
          pdf.setDrawColor(15,15,15); //add grey dividing line
          pdf.rect(left_margin, content_margin-3, 5, 5); // empty checkbox
          //X value (from left), Y value (from top), content
          pdf.text(inner_margin_A,content_margin,''+(i+1)+'. '+tasklist[i].folder_num); //row 1
          pdf.text(inner_margin_A+50,content_margin,''+tasklist[i].folder); //row 1
          // pdf.text(inner_margin_A+150,content_margin,'  <Notes>'); //row 1

          pdf.text(inner_margin_A,content_margin+5,''+tasklist[i].people); //row 2

          pdf.text(inner_margin_A,content_margin+10,'FP: '+tasklist[i].fp); //row 2
          pdf.text(inner_margin_A+50,content_margin+10,'PP: '+tasklist[i].pp); //row 2

          pdf.text(inner_margin_A,content_margin+15,'Time: '+tasklist[i].leg_time+''); //row 3
          pdf.text(inner_margin_A+50,content_margin+15,'Distance: '+tasklist[i].leg_dist+ ''); //row 3

          //if we are on the last leg, add the trip total distance,
          if (i == global_pdf.tasks.length-1){
            content_margin += 40;
            pdf.setFontType("bold");
            pdf.text(left_margin, content_margin,'Trip Time: '+global_pdf.trip_time+" minutes"); //final row
            pdf.text(left_margin+80, content_margin,'Trip Distance: '+global_pdf.trip_dist+" miles"); //final row
          } else if (content_margin >= page_height-80){
            //check current page height, if we need to go to a new page do that,
            pdf.addPage();
            page_count = page_count + 1;
            //and add new footer
            addFooter()
            content_margin = 30;
          } else {
            //else add a new line
            pdf.setLineWidth(0.25);
            pdf.setDrawColor(200,200,200); //add grey dividing line
            pdf.line(left_margin, content_margin+18, page_width, content_margin+18); // horizontal line
            content_margin += 27;
          }


        }

        pdf.output('datauri');
      }

}


  $("#createPDF").on('click', function(){
      console.log('printing....');
      createFinalPDF();
  });

  // setTimeout(function(){
  //   $("#app-action").show();
  //   $("#createPDF").trigger('click');
  // }, 3000)

});
