/*
   algo_dfs.js
   
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

function algo_dfs_childnodes(n) {
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
 
function algo_dfs_animate(flat_nodes) {
    flat_nodes.forEach(function(n){
        n.setLabel("?");
        n.fill("#ffffff");
    }, this);
    var algo_dfs_n = 0;
    var algo_dfs_label = 1;
    algo_dfs_interval = setInterval(function() {
        if (!flat_nodes[algo_dfs_n]) {
            clearInterval(algo_dfs_interval);
            algo_dfs_interval = null;
            return;
        }
        var t = flat_nodes[algo_dfs_n];
        if(t.algo_color == 'b') {
            t.fill("#CCCCCC");
            t.algo_color = 'd';
        } else {
            t.fill("#FF3300");
            t.setLabel(algo_dfs_label);
            algo_dfs_label += 1;
        }
        algo_dfs_n+=1;
    }, 1200);
}

function algo_dfs(n) {
    var flat_nodes = [];
    var stack=[];
    n.algo_color = 'g'; // gray
    stack.push(n);
    flat_nodes.push(n);
    while (stack.length) {
        var t = stack.pop();
        flat_nodes.push(t);
        t.algo_color = 'b';
        algo_dfs_childnodes(t).forEach(function(u){
            flat_nodes.push(u);
            u.algo_color = 'g'; 
            stack.push(u);
        });
    }
    return flat_nodes;
}

function algo_dfs_setup() {
    np.nodes.forEach(function(n) {
       n.algo_color = 'w'; // white
       n.group.click(function(){
           if(algo_armed !== dfs_panel) {return;}
           unclickAllNodes();
           algo_dfs_animate(algo_dfs(n));
           algo_armed.select("rect").attr({stroke: "#000"});
           algo_armed=null; 
       });
    }, np.nodes);
    
}
