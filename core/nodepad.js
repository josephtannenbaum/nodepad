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

var nodecount = 1;
var nodes=[];
function newnode() {

	var bigCircle = s.circle(150, 150, 50);
	bigCircle.attr({
	    fill: "#bada55", // is #bada55 intellectual property?
	    stroke: "#000",
	    strokeWidth: 5
	});

	var label = s.text(145, 155, nodecount);
	label.attr({"font-size":"20px"});
	
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
	nodes.push(grp);
	nodecount++;
}
