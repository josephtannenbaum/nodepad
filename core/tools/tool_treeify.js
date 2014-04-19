/*
   tool_treeify.js
   
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

function tool_treeify_childnodes(n) {
    var ret = [];
    n.edges.forEach(function(e) {
        var c = (e.dst != n) ? e.dst : e.src;
        if (c.algo_color == 'w') ret.push(c);
    }, this);
    //ret.reverse();
    return ret;
}
 
function tool_treeify_animate(flat_nodes) {
    var max_level = flat_nodes.pop(),
        tool_treeify_level = 0;
    tool_treeify_interval = setInterval(function() {
        if(tool_treeify_level > max_level) {
            clearInterval(tool_treeify_interval);
            tool_treeify_interval = null;
            return;
        }
        var x = 0;
        flat_nodes.forEach(function(n) {
            if(n.algo_color == tool_treeify_level) {
                gridMoveNode(n, x+1, tool_treeify_level);
                x+=1;
            }
        });
        tool_treeify_level+=1; 
    }, 100);
}

function tool_treeify(n) {
    var flat_nodes = [],
        max_level = 0,
        queue=[],
        level=1;
    n.algo_color = 0; // gray
    queue.push(n);
    flat_nodes.push(n);
    while (queue.length) {
        var t = queue.shift();
        tool_treeify_childnodes(t).forEach(function(u) {
            flat_nodes.push(u);
            u.algo_color = t.algo_color+1; 
            if(u.algo_color+1 > max_level) {
                max_level = u.algo_color+1;
            }
            queue.push(u);
        });
    }
    flat_nodes.push(max_level);
    return flat_nodes;
}

function tool_treeify_setup() {
    np.nodes.forEach(function(n) {
       n.algo_color = 'w'; // white
       n.group.click(function() {
           if(tool_armed !== tool_treeify_panel) return;
           unclickAllNodes();
           tool_treeify_animate(tool_treeify(n));
           tool_armed.select('rect').attr({stroke: '#000'});   
           tool_armed=null; 
       });
    }, np.nodes);
    
}
