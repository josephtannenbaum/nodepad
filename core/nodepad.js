/*
   nodepad.js
   
   Copyright 2014 Joe Tannenbaum <joseph.i.tannenbaum@gmail.com>
   
   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.
   
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   
   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
   MA 02110-1301, USA.
   
   
*/

const palette = {49:"#000", 50:"red",51:"purple",52: "blue"};
var currentcolor = "#000";

var nodecount = 1;
var nodes=[];
var hoveredgroup = null;

var sourcegroup = null;
var hoveredline = null;
var mouseX=0, mouseY=0;
var linestretchloop=null;

function putbehindall (allgroups, obj) {
	allgroups.forEach( function(item, i){
		if (obj.after) obj.after(item);
	}, allgroups );
}

function newnode() {

	var bigCircle = s.circle(150, 150, 50);
	bigCircle.attr({
	    fill: "#bada55", // is #bada55 intellectual property?
	    stroke: "#000",
	    strokeWidth: 5
	});

	var label = s.text(145, 155, nodecount);
	label.attr({"font-size":"20px"});
	
	var rays = Snap.set();
	
	grp = s.group(bigCircle, label);
	grp.hover(function(){bigCircle.attr({stroke: "orange"});},
	    function(){bigCircle.attr({stroke: "#000"});}
	);
	grp.drag();
	grp.drag(null,
	    function(){bigCircle.attr({stroke: "orange"});}
	);
	grp.click(function(){
			if ( window.event.shiftKey ) {
				this.remove();
				
			}
		}
	)
	grp.mouseover(function(){
			hoveredgroup = this;
		}
	);
	grp.mouseout(
		function() {
			hoveredgroup = null;
		}
	);
	allgroups.push(grp);
	nodecount++;
}

document.onkeydown = (function (ev) {
	
  var key= (event || window.event).keyCode;
  
  if (!linestretchloop && key == 90 && hoveredgroup) {
	sourcegroup = hoveredgroup
	ln = s.line(hoveredgroup.getBBox().cx, hoveredgroup.getBBox().cy, hoveredgroup.getBBox().cx, hoveredgroup.getBBox().cy);
  	ln.attr({
	    stroke: currentcolor,
	    strokeWidth: 5
	});
	
	hoveredgroup.before(ln);
	hoveredline = ln;
	linestretchloop = setInterval(function(){
	    x2 = ln.getBBox().x2;
	    y2 = ln.getBBox().y2;
	    ln.attr({"x2" : x2 + (mouseX - x2) / 2,
				"y2" : y2 + (mouseY - y2) / 2});
	    
	}, 10);
	
  } else if (linestretchloop && key == 90 && hoveredgroup) {
	    cx = hoveredgroup.getBBox().cx;
	    cy = hoveredgroup.getBBox().cy;
		hoveredline.attr({"x2" : cx,
				"y2" : cy});
		clearInterval(linestretchloop);
		putbehindall(allgroups, hoveredline);
		linestretchloop = null;
		hoveredline = null;
		sourcegroup = null;
  } else if (linestretchloop && key == 88) {
	  clearInterval(linestretchloop);
	  hoveredline.remove();
	  hoveredline = null;
	  sourcegroup = null;
	  linestretchloop = null;
  } else if (49 <= key && key <= 57) {
	  currentcolor = palette[key];
  }
});

$(document).mousemove(function(e){
   mouseX = e.pageX;
   mouseY = e.pageY; 
});
