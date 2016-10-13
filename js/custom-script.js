/*!
 * custom javascript script for github page
 */


$(document).ready(function() {
  'use strict';

	var dateString = "Oct 2016";

	console.log("hi! welcome to austin code's github!!!");
	$("#footnoteInsert").html(`
      <span class="label label-default">Last Update:
        <span id="dateString">`+dateString+`</span>
      </span>`);

 });
