/*!
 * custom javascript script for github page
 */


$(document).ready(function() {
  'use strict';

	const DATE_STRING = "Dec 2017";

	console.log("hi! welcome to austin code's github!!!");
	$("#footnoteInsert").html(''+
      '<span class="label label-default">Last Update: '+
        '<span id="dateString">'+DATE_STRING+'</span>'+
      '</span>');

  // $("#navbarInsert").html('<div class="container">'+
  //     '<div class="navbar-header">'+
  //       '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">'+
  //           '<span class="sr-only">Toggle navigation</span>'+
  //           '<span class="icon-bar"></span>'+
  //           '<span class="icon-bar"></span>'+
  //           '<span class="icon-bar"></span>'+
  //       '</button>'+
  //           '<a class="navbar-brand" href="#">Austin Code</a>'+
  //       '</div>'+
  //     '<div id="navbar" class="navbar-collapse collapse">'+
  //       '<ul class="nav navbar-nav">'+
  //             '<li><a href="index.html">Home</a></li>'+
  //             '<li><a href="about.html">About</a></li>'+
  //             '<li class="active"><a href="resources.html">Resources</a></li>'+
  //             '<li><a href="maps.html">Maps</a></li>'+
  //             '<li><a href="demographics.html">Demographics</a></li>'+
  //           '<li><a href="news.html">News</a></li>'+
  //         '</ul>'+
  //     '</div>'+
  //     '<!--/.nav-collapse -->'+
  // '</div>)');
  //
  // // $("#navbarInsert").val()

 });
