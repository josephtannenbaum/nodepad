/*
   nodepad_presets.js
   
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

function gridMoveNode(node, x, y, animation_time) {
    return node.move(50+x*100, 50+y*100, animation_time);
}

function makebinarytree() {
    np.clear();
    nD = gridPlaceNode(4,0, "D");
    nB = gridPlaceNode(2,1, "B");
    nF = gridPlaceNode(6,1, "F");
    nA = gridPlaceNode(1,2, "A");
    nC = gridPlaceNode(3,2, "C");
    nE = gridPlaceNode(5,2, "E");
    nG = gridPlaceNode(7,2, "G");
    np.drawEdge(nD, nB);
    np.drawEdge(nD, nF);
    np.drawEdge(nB, nA);
    np.drawEdge(nB, nC);
    np.drawEdge(nF, nE);
    np.drawEdge(nF, nG);
    
}

/* preset structures panel */
var p = Snap("#presets");
var pre_square =  p.rect(2, 10, 60, 60);
pre_square.attr({ fill: "#fff", stroke: "#000", strokeWidth: 1});
var ps_cx = pre_square.getBBox().cx;
var ps_cy = pre_square.getBBox().cy;
var pre_label = p.text(ps_cx - 18, ps_cy + 3, "presets");
pre_label.attr({
    "font-size": "12px"
});
var pre_panel = p.group(pre_square, pre_label);
var binary_panel = pre_panel.clone();
binary_panel.attr({display:"block"});
binary_panel.select("text").attr({text:"bin tree"});
binary_panel.after(pre_panel);
binary_panel.click(makebinarytree);

var binary_panel2 = pre_panel.clone();
binary_panel2.attr({display:"block"});
binary_panel2.select("text").attr({text:"bin tree"});
binary_panel2.after(pre_panel);
binary_panel2.after(binary_panel);
binary_panel2.click(makebinarytree);

function present_presets() {
    binary_panel.animate({transform: "t0,70",},80);
    binary_panel.click(function() {
        this.select("rect").attr({stroke: "#bada55"});
        this.select("rect").animate({stroke: "#000"}, 800);
    }, binary_panel);
    binary_panel2.animate({transform: "t0,140",},90);
    binary_panel2.click(function() {
        this.select("rect").attr({stroke: "#bada55"});
        this.select("rect").animate({stroke: "#000"}, 800);
    }, binary_panel2);
}
pre_panel.mouseover(present_presets);

/* animations panel */
var animation_square =  p.rect(72, 10, 60, 60);
animation_square.attr({ fill: "#fff", stroke: "#000", strokeWidth: 1});
var animation_label = p.text(animation_square.getBBox().cx - 25, animation_square.getBBox().cy + 3, "animations");
animation_label.attr({
    "font-size": "11px"
});
var animation_panel = p.group(animation_square, animation_label);
var dfs_panel = animation_panel.clone();
dfs_panel.attr({display:"block"});
dfs_panel.select("text").attr({text:"DFS", "font-size": "12px", x: dfs_panel.getBBox().cx-12});
dfs_panel.after(animation_panel);
dfs_panel.click(dfs);

function present_animations() {
    dfs_panel.animate({transform: "t0,70",},80);
    dfs_panel.click(function() {
        this.select("rect").attr({stroke: "#bada55"});
        this.select("rect").animate({stroke: "#000"}, 800);
    }, dfs_panel);
}
animation_panel.mouseover(present_animations);

/* algorithms panel */
var algo_square =  p.rect(142, 10, 60, 60);
algo_square.attr({ fill: "#fff", stroke: "#000", strokeWidth: 1});
var algo_label = p.text(algo_square.getBBox().cx - 25, algo_square.getBBox().cy + 3, "algorithms");
algo_label.attr({
    "font-size": "11px"
});
var algo_panel = p.group(algo_square, algo_label);
var flood_panel = algo_panel.clone();
flood_panel.attr({display:"block"});
flood_panel.select("text").attr({text:"flood", "font-size": "12px", x: flood_panel.getBBox().cx-12});
flood_panel.after(algo_panel);
flood_panel.click(flood_setup);

function present_algos() {
    flood_panel.animate({transform: "t0,70",},80);
    flood_panel.click(function() {
            notif({
          type: "success",
          msg: "Click on a node to start the algorithm...",
          position: "right",
          bgcolor: "#bada55",
          fade: true,
          width: 350,
          timeout:2000
        });
        this.select("rect").attr({stroke: "#bada55"});
        this.select("rect").animate({stroke: "#000"}, 800);
    }, flood_panel);
}
algo_panel.mouseover(present_algos);
