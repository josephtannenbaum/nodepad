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
    return node.move(50+x*115, 50+y*115, animation_time);
}

function unclickAllNodes() { 
    np.nodes.forEach(function(n) {n.group.unclick();});
}

function makebinarytree() {
    np.clear();
    nD = gridPlaceNode(4,0, 'D');
    nB = gridPlaceNode(2,1, 'B');
    nF = gridPlaceNode(6,1, 'F');
    nA = gridPlaceNode(1,2, 'A');
    nC = gridPlaceNode(3,2, 'C');
    nE = gridPlaceNode(5,2, 'E');
    nG = gridPlaceNode(7,2, 'G');
    np.drawEdge(nD, nB);
    np.drawEdge(nD, nF);
    np.drawEdge(nB, nA);
    np.drawEdge(nB, nC);
    np.drawEdge(nF, nE);
    np.drawEdge(nF, nG);
}

function make9square() {
    np.clear();
    n1 = gridPlaceNode(1,1,'A');
    n2 = gridPlaceNode(1,3,'B');
    n3 = gridPlaceNode(1,5,'C');
    n4 = gridPlaceNode(3,1,'D');
    n5 = gridPlaceNode(3,3,'E');
    n6 = gridPlaceNode(3,5,'F');
    n7 = gridPlaceNode(5,1,'G');
    n8 = gridPlaceNode(5,3,'H');
    n9 = gridPlaceNode(5,5,'I');
    np.drawEdge(n1,n2);
    np.drawEdge(n1,n5);
    np.drawEdge(n2,n3);
    np.drawEdge(n3,n6);
    np.drawEdge(n4,n7);
    np.drawEdge(n4,n5);
    np.drawEdge(n5,n7);
    np.drawEdge(n5,n8);
    np.drawEdge(n5,n6);
    np.drawEdge(n6,n9);
    np.drawEdge(n8,n9);
}

/* preset structures panel */
var p = Snap('#presets'),
    pre_square =  p.rect(2, 10, 60, 60);
pre_square.attr({ fill: '#fff', stroke: '#000', strokeWidth: 1});
var pre_mask = pre_square.clone(); pre_mask.attr({opacity: 0});
    ps_cx = pre_square.getBBox().cx,
    ps_cy = pre_square.getBBox().cy;
var pre_label = p.text(ps_cx - 18, ps_cy + 3, 'presets');
pre_label.attr({
    'font-size': '12px'
});
var pre_panel = p.group(pre_square, pre_label, pre_mask);
var binary_panel = pre_panel.clone();
binary_panel.attr({display:'block'});
binary_panel.select('text').attr({text:'bin tree'});
binary_panel.after(pre_panel);
binary_panel.mouseup(makebinarytree);

var nine_square_panel = pre_panel.clone();
nine_square_panel.attr({display:'block'});
nine_square_panel.select('text').attr({text:'9-square'});
nine_square_panel.after(pre_panel);
nine_square_panel.after(binary_panel);
nine_square_panel.mouseup(make9square);

var presets_presented = false,
    preset_menu_timeout = null;
pre_panel.mouseover(function() {
    window.clearTimeout(preset_menu_timeout);
    if(presets_presented) return;
    presets_presented = true;
    binary_panel.animate({transform: 't0,70',},80);
    nine_square_panel.animate({transform: 't0,140',},90);
});

binary_panel.mouseup(function() {
    this.select('rect').attr({stroke: '#bada55'});
    this.select('rect').animate({stroke: '#000'}, 800);
}, binary_panel);
nine_square_panel.mouseup(function() {
    this.select('rect').attr({stroke: '#bada55'});
    this.select('rect').animate({stroke: '#000'}, 800);
}, nine_square_panel);

function preset_menu_doom() {
    preset_menu_timeout = window.setTimeout(function() {
        binary_panel.animate({transform: 't0,0',},80);
        nine_square_panel.animate({transform: 't0,0',},90);
        presets_presented = false;
        preset_menu_timeout = null;
    }, 4500);
}

pre_panel.mouseout(preset_menu_doom);
binary_panel.mouseout(preset_menu_doom);
binary_panel.mouseover(function() {window.clearTimeout(preset_menu_timeout);});
nine_square_panel.mouseout(preset_menu_doom);
nine_square_panel.mouseover(function() {window.clearTimeout(preset_menu_timeout);});

/* algorithms panel */
var algo_square =  p.rect(72, 10, 60, 60);
algo_square.attr({ fill: '#fff', stroke: '#000', strokeWidth: 1});
var algo_mask =  algo_square.clone(); algo_mask.attr({opacity:0});
var algo_label = p.text(algo_square.getBBox().cx - 25, algo_square.getBBox().cy + 3, 'algorithms');
algo_label.attr({
    'font-size': '11px'
});
var algo_panel = p.group(algo_square, algo_label,algo_mask);
var flood_panel = algo_panel.clone();
flood_panel.attr({display:'block'});
flood_panel.select('text').attr({text:'flood', 'font-size': '12px', x: flood_panel.getBBox().cx-12});
flood_panel.after(algo_panel);
flood_panel.mouseup(algo_flood_setup);

var bfs_panel = algo_panel.clone();
bfs_panel.attr({display:'block'});
bfs_panel.select('text').attr({text:'BFS', 'font-size': '12px', x: flood_panel.getBBox().cx-11});
bfs_panel.after(algo_panel);
bfs_panel.mouseup(algo_bfs_setup);

var dfs_panel = algo_panel.clone();
dfs_panel.attr({display:'block'});
dfs_panel.select('text').attr({text:'DFS', 'font-size': '12px', x: flood_panel.getBBox().cx-11});
dfs_panel.after(algo_panel);
dfs_panel.mouseup(algo_dfs_setup);

algo_panel.mouseover(function () {
    window.clearTimeout(algo_menu_timeout);
    if(algos_presented) return;
    algos_presented = true;
    flood_panel.animate({transform: 't0,70',},80);
    dfs_panel.animate({transform: 't0,210',},80);
    bfs_panel.animate({transform: 't0,140',},80);
});

var algo_armed = false,
    algos_presented = false,
    algo_menu_timeout = null;
function algo_menu_doom() {
    algo_menu_timeout = window.setTimeout(function() {
        flood_panel.animate({transform: 't0,0',},80);
        bfs_panel.animate({transform: 't0,0',},80);
        dfs_panel.animate({transform: 't0,0',},80);
        algos_presented = false;
        algo_menu_timeout = null;
    }, 4500);
}

algo_panel.mouseout(algo_menu_doom);
dfs_panel.mouseout(algo_menu_doom);
dfs_panel.mouseover(function() {window.clearTimeout(algo_menu_timeout);});
bfs_panel.mouseout(algo_menu_doom);
bfs_panel.mouseover(function() {window.clearTimeout(algo_menu_timeout);});
flood_panel.mouseout(algo_menu_doom);
flood_panel.mouseover(function() {window.clearTimeout(algo_menu_timeout);});

flood_panel.mouseup(function() {
    if(algo_armed) {
        unclickAllNodes();
        algo_armed.select('rect').attr({stroke: '#000'});            
        if(algo_armed === this) {
            nodepad_notif('Flood algorithm action cancelled');
            algo_armed=false;
            return;
        }
    }
    algo_armed = this;
    nodepad_notif('Click on a node to start flood algorithm... (click panel again to cancel)');
    this.select('rect').attr({stroke: '#bada55'});
}, flood_panel);
bfs_panel.mouseup(function() {
        if(algo_armed) {
            unclickAllNodes();
            algo_armed.select('rect').attr({stroke: '#000'});
            if(algo_armed === this) {
                nodepad_notif('BFS algorithm action cancelled');
                algo_armed=false;
                return;
            }
        }
        algo_armed = this;
        nodepad_notif('Click on a node to start BFS algorithm... (click panel again to cancel)');
        this.select('rect').attr({stroke: '#bada55'});
}, bfs_panel);
dfs_panel.mouseup(function() {
    if(algo_armed) {
        unclickAllNodes();
        algo_armed.select('rect').attr({stroke: '#000'});
        if(algo_armed === this) {
            nodepad_notif('DFS algorithm action cancelled');
            algo_armed=false;
            return;
        }
    }
    algo_armed = this;
    nodepad_notif('Click on a node to start DFS algorithm... (click panel again to cancel)');
    this.select('rect').attr({stroke: '#bada55'});
}, dfs_panel);

/* tools */

var tool_square =  p.rect(142, 10, 60, 60);
tool_square.attr({ fill: '#fff', stroke: '#000', strokeWidth: 1});
var tool_mask =  tool_square.clone(); tool_mask.attr({opacity:0});
var tool_label = p.text(tool_square.getBBox().cx - 14, tool_square.getBBox().cy + 3, 'tools');
tool_label.attr({
    'font-size': '11px'
});
var tool_panel = p.group(tool_square, tool_label,tool_mask);
var tool_treeify_panel = tool_panel.clone();
tool_treeify_panel.select('text').attr({x: tool_square.getBBox().cx - 19 });
tool_treeify_panel.attr({display:'block'});
tool_treeify_panel.select('text').attr({text:'organize'});
tool_treeify_panel.after(tool_panel);
//syke! tool_treeify_panel.mouseup(tool_treeify_setup);


var tool_tolatex_panel = tool_panel.clone();
tool_tolatex_panel.select('text').attr({x: tool_square.getBBox().cx - 22 });
tool_tolatex_panel.attr({display:'block'});
tool_tolatex_panel.select('text').attr({text:'to LaTeX'});
tool_tolatex_panel.after(tool_panel);
tool_tolatex_panel.mouseup(tool_tolatex);

var tool_topng_panel = tool_panel.clone();
tool_topng_panel.select('text').attr({x: tool_square.getBBox().cx - 20 });
tool_topng_panel.attr({display:'block'});
tool_topng_panel.select('text').attr({text:'to PNG'});
tool_topng_panel.after(tool_panel);
tool_topng_panel.mouseup(tool_topng);

var tools_presented = false,
    tool_menu_timeout = null;
tool_panel.mouseover(function() {
    window.clearTimeout(tool_menu_timeout);
    if(tools_presented) return;
    tools_presented = true;
    tool_treeify_panel.animate({transform: 't0,70',},80);
    tool_topng_panel.animate({transform: 't0,140',},90);
    tool_tolatex_panel.animate({transform: 't0,210',},100);
});

function tool_menu_doom() {
    tool_menu_timeout = window.setTimeout(function() {
        tool_treeify_panel.animate({transform: 't0,0',},80);
        tool_topng_panel.animate({transform: 't0,0',},90);
        tool_tolatex_panel.animate({transform: 't0,0',},90);
        tools_presented = false;
        tool_menu_timeout = null;
    }, 4500);
}
var tool_armed = null;
tool_panel.mouseout(tool_menu_doom);

tool_treeify_panel.mouseout(tool_menu_doom);
tool_treeify_panel.mouseover(function() {window.clearTimeout(tool_menu_timeout);});
tool_treeify_panel.mouseup(function() {
    nodepad_notif("I don't actually work yet...");
    return;
    // syke!
    
    if(tool_armed) {
        unclickAllNodes();
        tool_armed.select('rect').attr({stroke: '#000'});
        if(tool_armed === this) {
            nodepad_notif('node organizing action cancelled');
            tool_armed = false;
            return;
        }
    }
    tool_armed = this;
    tool_treeify_setup();
    nodepad_notif('Select a root node to organize around... (click panel again to cancel)');
    this.select('rect').attr({stroke: '#bada55'});
}, tool_treeify_panel);

tool_tolatex_panel.mouseout(tool_menu_doom);
tool_tolatex_panel.mouseover(function() {window.clearTimeout(tool_menu_timeout);});

tool_topng_panel.mouseout(tool_menu_doom);
tool_topng_panel.mouseover(function() {window.clearTimeout(tool_menu_timeout);});
