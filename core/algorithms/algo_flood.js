/*
   algo_flood.js
   
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

function algo_flood_childnodes(n) {
    var ret = [];
    n.edges.forEach(function(e) {
        var c = (e.dst != n) ? e.dst : e.src;
        if (c.algo_color == 'w') {
            ret.push(c);
        }
    }, this);
    ret.reverse();
    return ret;
}
 
function algo_flood_animate(flat_nodes) {
    var max_level = flat_nodes.pop(),
        algo_flood_level = 0;
    flat_nodes.forEach(function(n) {
        n.setLabel('?');
        n.fill('#ffffff');
    }, this);
    algo_flood_interval = setInterval(function() {
        if(algo_flood_level > max_level) {
            clearInterval(algo_flood_interval);
            algo_flood_interval = null;
            return;
        }
        flat_nodes.forEach(function(n) {
            if(n.algo_color == algo_flood_level) {
                n.fill('#55b9da');
                n.setLabel(algo_flood_level+1);
            }
        });
        algo_flood_level+=1; 
    }, 1200);
}

function algo_flood(n) {
    var flat_nodes = [],
        max_level = 0,
        queue=[];
    n.algo_color = 0; // gray
    queue.push(n);
    flat_nodes.push(n);
    var level=1;
    while (queue.length) {
        var t = queue.shift();
        algo_flood_childnodes(t).forEach(function(u) {
            flat_nodes.push(u);
            u.algo_color = t.algo_color+1; 
            if(u.algo_color+1 > max_level) max_level = u.algo_color+1;
            queue.push(u);
        });
    }
    flat_nodes.push(max_level);
    return flat_nodes;
}

function algo_flood_setup() {
    np.nodes.forEach(function(n) {
       n.algo_color = 'w'; // white
       n.group.click(function() {
           if(algo_armed !== flood_panel) return;
           unclickAllNodes();
           algo_flood_animate(algo_flood(n));
           algo_armed.select('rect').attr({stroke: '#000'});   
           algo_armed=null; 
       });
    }, np.nodes);
    
}
