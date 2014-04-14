/*
   animation_dfs.js
   
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

var dfs_nodes = [];
var dfs_interval;
var dfs_count = 1;
function dfs() {
    if(dfs_interval) {clearInterval(dfs_interval);}
    dfs_count = 1;
    np.clear();
    var n1 = gridPlaceNode(4, 0, "?");
    var n2 = gridPlaceNode(3, 1, "?");
    var n3 = gridPlaceNode(2, 2, "?");
    var n4 = gridPlaceNode(1, 3, "?");
    var n5 = gridPlaceNode(2, 3, "?");
    var n6 = gridPlaceNode(3, 2, "?");
    var n7 = gridPlaceNode(4, 1, "?");
    var n8 = gridPlaceNode(5, 1, "?");
    var n9 = gridPlaceNode(5, 2, "?");
    var n10 = gridPlaceNode(5, 3, "?");
    var n11 = gridPlaceNode(6, 3, "?");
    var n12 = gridPlaceNode(6, 2, "?");
    np.drawEdge(n1, n2);
    np.drawEdge(n1, n7);
    np.drawEdge(n1, n8);
    np.drawEdge(n2, n3);
    np.drawEdge(n2, n6);
    np.drawEdge(n3, n4);
    np.drawEdge(n3, n5);  
    np.drawEdge(n8, n9);
    np.drawEdge(n8, n12);
    np.drawEdge(n9, n11);
    np.drawEdge(n9, n10);
    dfs_nodes.push(n12, n11, n10, n9, n8,n7,n6,n5,n4,n3,n2,n1);
    dfs_interval = setInterval(function() {
        var n = dfs_nodes.pop();
        if (!n) {
            clearInterval(dfs_interval);
            return;
        }
        n.fill("#dab855");
        n.setLabel(dfs_count);
        dfs_count+=1;
    }, 1300);
}
