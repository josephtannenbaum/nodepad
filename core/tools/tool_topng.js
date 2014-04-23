/*
   tool_topng.js
   
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

function tool_topng_image_size() {
    var maxX = 0, maxY = 0;
    np.nodes.forEach(function(n) {
       if (n.x > maxX) maxX = n.x;
       if (n.y > maxY) maxY = n.y; 
    });
    return [maxX+150, maxY+200];
}

function tool_topng() {
    if (!np.nodes.length) {
        nodepad_notif("The Nodepad is empty!");
        return;
    }
    if (!canvg) {
        nodepad_notif("Error: Canvas library not found");
        return;
    }
    nodepad_keylock = true;
    var dialogSize = tool_topng_image_size();
    var dialogWidth = dialogSize[0],
        dialogHeight = dialogSize[1];
    
    // make temporary <canvas> 
    $('<canvas id="canvas" width="' + dialogWidth
      + 'px" height="'+ dialogHeight 
      +'px" style="display:none"></canvas> ').insertAfter('body');
    
    // put SVG into canvas and convert to PNG
    var _myCanvas = document.getElementById("canvas");
    canvg(_myCanvas, np.s.toString());
    var img = _myCanvas.toDataURL("image/png");
    $('<div id="tool_topng" title="Export as PNG">\
    <p style="font-size: 11pt">Right-click -> Save As</p>\
    <img src="'+img+'"/>\
    </div>').insertAfter('body');
    
    $( '#tool_topng' ).dialog({
      height: dialogHeight,
      width: dialogWidth,
      modal: true,
      resizable: false,
      dialogClass: "tool_topng_dialog",
      close: function() {
          nodepad_keylock = false;
          this.remove();
          $( '.ui-dialog' ).remove();
          _myCanvas.remove();
      }
    });
    
}
