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

function gridPlaceNode(x, y, label, fill) {
    return np.placeNode(50+x*100, 50+y*100, label, fill, true);
}

var algo_dfs_nodes = [];
var algo_dfs_interval;
var algo_dfs_count = 1;
function algo_dfs() {
    np.clear();
    n1 = gridPlaceNode(4, 0, "?");
    n2 = gridPlaceNode(3, 1, "?");
    n3 = gridPlaceNode(2, 2, "?");
    n4 = gridPlaceNode(1, 3, "?");
    n5 = gridPlaceNode(2, 3, "?");
    n6 = gridPlaceNode(3, 2, "?");
    n7 = gridPlaceNode(4, 1, "?");
    n8 = gridPlaceNode(5, 1, "?");
    n9 = gridPlaceNode(5, 2, "?");
    n10 = gridPlaceNode(5, 3, "?");
    n11 = gridPlaceNode(6, 2, "?");
    n12 = gridPlaceNode(6, 3, "?");
    np.drawEdge(n1, n2);
    np.drawEdge(n1, n7);
    np.drawEdge(n1, n8);
    np.drawEdge(n2, n3);
    np.drawEdge(n2, n6);
    np.drawEdge(n3, n4);
    np.drawEdge(n3, n5);  
    np.drawEdge(n8, n9);
    np.drawEdge(n8, n11);
    np.drawEdge(n9, n12);
    np.drawEdge(n9, n10);
    algo_dfs_nodes.push(n12, n11, n10, n9, n8,n7,n6,n5,n4,n3,n2,n1);
    algo_dfs_interval = setInterval(function() {
        var n = algo_dfs_nodes.pop();
        if (!n) {
            clearInterval(algo_dfs_interval);
            return;
        }
        n.fill("#dab855");
        n.setLabel(algo_dfs_count);
        algo_dfs_count+=1;
    }, 1300);
}
