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

function inSet(s, n) {
    var ret = false;
    s.forEach(function(e){
        if(e == n){ret = true;return false;}
    })
    return ret;
}


var algo_flood_interval;
var algo_flood_n;
function flood(s) {
    algo_flood_n = 1;
    algo_flood_interval = setInterval(function() {
        if (!s[algo_flood_n]) {
            clearInterval(algo_flood_interval);
            return;
        }
        s[algo_flood_n].forEach(function(n){
            n.fill("#55b9da");
        }, this);
        algo_flood_n+=1;
    }, 1300);
}

function getfloodset(level, s, n, todo_nodes) {
    if(level > 5) {return;}
    if (!s[level]) {s[level] = Snap.set();}
    n.edges.forEach(function(e) {
        var c = (e.dst != n) ? e.dst : e.src;
        if (inSet(todo_nodes,c)) {
            s[level].push(c);
            todo_nodes.exclude(c);
            getfloodset(level+1, s, c, todo_nodes);
        }
    }, this);
}

function flood_setup() {
    np.nodes.forEach(function(node) {
        node.group.click(function(){ 
            var todo_nodes = Snap.set();
            np.nodes.forEach(function(n) {todo_nodes.push(n);n.group.unclick()});
            var zeroset = Snap.set();
            node.fill("#55b9da");
            zeroset.push(node);
            todo_nodes.exclude(node);
            var floodset = {0:zeroset};
            getfloodset(1, floodset, node, todo_nodes);
            flood(floodset);
        });
    }, np.nodes);
}
