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

function makebinarytree() {
    np.clear();
    n1 = np.placeNode(425,200, "1", false, true);
    n2 = np.placeNode(500,100, "2", false, true);
    n3 = np.placeNode(575,200, "3", false, true);
    np.drawEdge(n2, n1);
    np.drawEdge(n2, n3);
}

var p = Snap("#presets");
var pre_square =  p.rect(2, 10, 50, 50);
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
    binary_panel.animate({transform: "t0,60",},80);
    binary_panel2.animate({transform: "t0,120",},90);
}
pre_panel.mouseover(present_presets);

