/*
   tool_tolatex.js
   
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

// requires JQuery UI

// .format() for strings
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

var TOOL_TOLATEX_NODESTR = "  \\node ({0}) at ({1},{2}) [fill=npf{3}] \{{4}\};";
var TOOL_TOLATEX_COLORSTR = "\\definecolor\{npf{0}\}\{HTML\}\{{1}\}";
var TOOL_TOLATEX_GRAPHSTR = "\\begin{tikzpicture}\n\
  [auto=left,every node/.style=\{circle, draw\}]\n\
  {0}\n\
\n\
  \\foreach \\from/\\to in \{{1}\}\n\
    \\draw (\\from) -- (\\to);\n\
\n\
\\end{tikzpicture}\n"

function tool_tolatex_str() {
    
    // create necessary color definitions
    var fills = [];
    np.nodes.forEach(function(n){
        if (fills.indexOf(n.currentfill) === -1) fills.push(n.currentfill);
    });
    var fillsDefines = [];
    fills.forEach(function(f){
        var hex = f.replace("#","").toUpperCase();
        fillsDefines.push(TOOL_TOLATEX_COLORSTR.format(hex, hex));
    })
    var fillDefineStr = fillsDefines.join("\n");
    
    // build list of nodes (scale is magic num for now...)
    var nodelist = [];
    np.nodes.forEach(function(n){
        var nodename = "n"+n.group.id;
        var nodex = n.x/128.0;
        var nodey = n.y/128.0;
        var nodefill = n.currentfill.replace("#","").toUpperCase();
        nodelist.push(TOOL_TOLATEX_NODESTR.format(nodename, 
                                                  nodex,
                                                  10-nodey,
                                                  nodefill,
                                                  n.label))
    });
    
    // build list of edges
    var nodelistStr = nodelist.join("\n");
    var edgelist = [];
    np.edges.forEach(function(e) {        
        edgelist.push("n"+e.src.group.id+"/n"+e.dst.group.id);
    });
    var edgelistStr = edgelist.join(",");
    
    var graphstr = TOOL_TOLATEX_GRAPHSTR.format(nodelistStr,
                                                edgelistStr);
    return fillDefineStr +"\n"+ graphstr;
}

function tool_tolatex() {
    if (!np.nodes.length) {
        nodepad_notif("The Nodepad is empty!");
        return;
    }
    nodepad_keylock = true;
    $('<div id="tool_tolatex" title="Export as LaTeX">\
    <p style="font-size: 11pt">Be sure to add \\usepackage\{tikz\} to your header!</p>\
    <textarea rows=20 cols=82 style="font-size: 8pt">{0}</textarea>\
    </div>'.format(tool_tolatex_str())).insertAfter('body');
    $( '#tool_tolatex' ).dialog({
      height: 400,
      width: 600,
      resizable: false,
      modal: true,
      close: function() {
          nodepad_keylock = false;
          this.remove();
          $( '.ui-dialog' ).remove();
      }
    });
}
