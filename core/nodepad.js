/*
   nodepad.js
   
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

$.jGrowl.defaults.closer = false;
$.jGrowl.defaults.closeTemplate = false;
function nodepad_notif(msg) {
    $.jGrowl(msg, {
        theme: 'bad',
        closer: false,
        life: 2000
        });
}

function assert(condition, message) {
    if (!condition) {
        throw message || 'Assertion failed';
    }
}
var mouseX = 0,
    mouseY = 0;
$(document).mousemove(function (e) {
    'use strict';
    mouseX = e.pageX;
    mouseY = e.pageY;
});

var defaultHighlightColor = 'orange',
    defaultEdgeColor = '#000',
    palette = {
    49: '#bada55',
    50: '#C14C44',
    51: '#da55ba',
    52: '#c89dbf',
    53: '#dab855',
    54: '#55bada'
    },
    defaultCurrentColor = palette[49],
    defaultNodeRadius = 36,
    defaultEdgeStrokeWidth = 5,
    defaultNodeStrokeWidth = 4;

function Node(nodegroup) {
    this.group = nodegroup;
    this.label = nodegroup.select('text').text;
    this.x = nodegroup.getBBox().cx;
    this.y = nodegroup.getBBox().cy;
    this.edges = Snap.set();
    this.outedges = Snap.set();
    this.inedges = Snap.set();
    this.fill = function(fill) {
        this.group.select('circle').attr({fill: fill});
    }
    this.setLabel = function(label) {
        this.group.select('text').attr({text: label});
        this.label = label;
    }
    this.move = function(newx, newy, animation_time) {
        
        // FIXME: the whole function doesn't because Snap
        if(animation_time) {
            var thisnode = this;
            var setterX = function(n) {
                thisnode.edges.forEach(function (edge) {
                    if (edge.src == thisnode) {
                        edge.line.attr({x1: n});
                    } else {
                        edge.line.attr({x2: n});
                    }
                }, thisnode);
            };
            var setterY = function(n) {
                thisnode.edges.forEach(function (edge) {
                    if (edge.src == thisnode) {
                        edge.line.attr({y1: n});
                    } else {
                        edge.line.attr({y2: n});
                    }
                }, thisnode);
            }
            var dx = newx - this.x;
            var dy = newy - this.y;
            this.group.animate({transform:'t'+dx+','+dy}, animation_time);
            Snap.animate(this.x, newx, setterX, animation_time);
            Snap.animate(this.y, newy, setterY, animation_time);
            this.x = newx;
            this.y = newy;
        } else {
            var dx = newx - this.x;
            var dy = newy - this.y;
            //this.group.animate({transform: 't0,0'}, 0, mina.linear);
            //this.group.animate({transform: 't'+dx+','+dy}, 100, mina.linear);
            this.group.animate({transform:this.group.matrix.translate(dx,dy)});
            //this.real_x = newx;
            //this.real_y = newy;
            this.edges.forEach(function (edge) {
                if (edge.src == this) {
                    //edge.line.attr({x1: this.x, y1: this.y});
                    edge.line.attr({x1: newx, y1: newy});
                } else {
                    //edge.line.attr({x2: this.x, y2: this.y});
                    edge.line.attr({x2: newx, y2: newy});
                }
            }, this);
        }
    }
    this.remove = function() {
        this.group.remove();
    }
    this.pushEdge = function(edge, am_src) {
        this.edges.push(edge);
        (am_src ? this.outedges : this.inedges).push(edge);
    }
}
function Edge(line, srcnode, dstnode) {
    this.line = line;
    this.src = srcnode;
    this.dst = dstnode;
    this.remove = function() {
        this.line.remove();
    }
}
function Nodepad(selector) {
    this.s = Snap(selector);
    this.nodes = Snap.set();
    this.edges = Snap.set();
    this.currentfill = defaultCurrentColor;
    this.nodecount = 1;
    
    this.sendToBack = function(shape) {
        this.nodes.forEach(function (node) {
            shape.after(node.group);
        }, this.nodes); 
    }
    this.sendToFront = function(shape) {
        this.nodes.forEach(function (node) {
            shape.before(node.group);
        }, this.nodes); 
    }
    this.drawEdge = function(srcnode, dstnode) {
        var line = this.s.line(srcnode.x, srcnode.y, dstnode.x, dstnode.y);
        line.attr({
            stroke: defaultEdgeColor,
            strokeWidth: defaultEdgeStrokeWidth
        });
        this.sendToBack(line);
        var newedge = new Edge(line, srcnode, dstnode);
        srcnode.pushEdge(newedge, true);
        dstnode.pushEdge(newedge, false);
        this.edges.push(newedge);
        this.hoverednode = null;
        return newedge;
    }
    this.startEdge = function() {
        this.sourcenode = this.hoverednode;
        var line = this.s.line(this.hoverednode.x, this.hoverednode.y, this.hoverednode.x, this.hoverednode.y);
        line.attr({
            stroke: defaultEdgeColor,
            strokeWidth: defaultEdgeStrokeWidth
        });
        this.draggingline = line;
        this.sendToBack(line);
        this.sendToFront(this.sourcenode.group);
        this.edgestretchloop = setInterval(function () {
            var x2 = line.getBBox().x2;
            var y2 = line.getBBox().y2;
            line.attr({
                'x2': x2 + (mouseX - x2),
                'y2': y2 + (mouseY - y2)
            });

        }, 5);
    }
    this.cancelEdge = function() {
        if (this.edgestretchloop) clearInterval(this.edgestretchloop);
        if (this.draggingline) this.draggingline.remove();
        this.draggingline = null;
        this.sourcenode = null;
        this.edgestretchloop = null;
        this.hoverednode = null;
    }
    this.placeEdge = function(srcnode, dstnode) {
        if(srcnode == dstnode) return;
        this.draggingline.attr({
            'x2': dstnode.x,
            'y2': dstnode.y
        });
        var newedge = new Edge(this.draggingline, srcnode, dstnode);
        srcnode.pushEdge(newedge, true);
        dstnode.pushEdge(newedge, false);
        this.edges.push(newedge);
        clearInterval(this.edgestretchloop);
        this.sendToBack(this.draggingline);
        this.edgestretchloop = null;
        this.draggingline = null;
        this.sourcenode = null;
        return newedge;
    }
    this.removeEdge = function(edge) {
        this.edges.exclude(edge);
        edge.remove();
    }
    this.placeNode = function(x, y, label, fill, nohighlight) {
        /* start with a group... */
        var nodecircle = this.s.circle(x, y, defaultNodeRadius);
        nodecircle.attr({
            fill: fill || this.currentfill,
            stroke: nohighlight ? '#000' : defaultHighlightColor,
            strokeWidth: defaultNodeStrokeWidth
        });
        var nodemask = nodecircle.clone(); nodemask.attr({opacity: 0});
        var nodelabel = this.s.text(x - 5, y + 5, label || this.nodecount);
        nodelabel.attr({'font-size': '20px'});
        var nodegroup = this.s.group(nodecircle, nodelabel, nodemask);
        
        /* node set stuff */
        var newnode = new Node(nodegroup);
        newnode.label = label || this.nodecount;
        this.nodes.push(newnode);
        this.nodecount += 1;
        this.lasthoverednode = this.hoverednode;
        this.hoverednode = newnode;
        
        /* node-hovering behavior */
        nodegroup.hover(function () {
            if (!np.draggingnode) {
                nodegroup.select('circle').attr({
                    stroke: defaultHighlightColor
                });
            }
        },
        function () {
            if (!np.draggingnode) {
                nodegroup.select('circle').attr({
                    stroke: '#000'
                });
            }
        });
        
        /* node-dragging behavior */
        nodegroup.drag();
        nodegroup.drag(function(dx, dy, x, y, e) { // onmove
            newnode.x = newnode.group.getBBox().cx;
            newnode.y = newnode.group.getBBox().cy;
            newnode.edges.forEach(function (edge) {
                if (edge.src == newnode) {
                    edge.line.attr({x1: newnode.x, y1: newnode.y});
                } else {
                    edge.line.attr({x2: newnode.x, y2: newnode.y});
                }
            }, newnode.edges);
        },
        function (x, y, e) { // onstart
            np.draggingnode = np.hoverednode || np.lasthoverednode;
            np.sendToFront(nodegroup);
            nodegroup.select('circle').attr({stroke: defaultHighlightColor});
        },
        function (e) { // onend 
            np.draggingnode = null;
        });
        
        /* hovering behavior */
        nodegroup.mouseover(function () {
            if(!np.draggingnode) np.hoverednode = newnode;
        });
        nodegroup.mouseout(function () {
            if(!np.draggingnode) {
                np.lasthoverednode = np.hoverednode;
                np.hoverednode = null;
            }
        });
        return newnode;
    }
    this.removeNode = function(node, keep_in_nodeset) {
        node.edges.forEach(function(edge) {
            this.removeEdge(edge);
        }, this);
        node.remove();
        if (!keep_in_nodeset) this.nodes.exclude(node);
        this.hoverednode = null;
    }
    this.fillNode = function(fill, node) {
        node = node || this.hoverednode;
        fill = fill || this.currentfill
        node.fill(fill);
    }
    this.setCurrentColor = function(fill) {
        this.currentfill = fill;
    }
    this.clear = function() {
        this.cancelEdge();
        this.nodes.forEach(function(node) {
            this.removeNode(node, true);
        }, this);
        this.nodes.clear();
        this.edges.clear();
        this.nodecount = 1;
    }
}

document.onkeydown = function (ev) {
    'use strict';
    assert(np, 'Error: np var not found!');
    var key = (ev || window.event).keyCode;
    if (key === 90) { // Z press
        if (!np.edgestretchloop && !np.hoverednode) {
            np.placeNode(mouseX, mouseY);
        } else if (!np.edgestretchloop && np.hoverednode) {
            np.startEdge();
        } else if (np.edgestretchloop && np.hoverednode) {
            np.placeEdge(np.sourcenode, np.hoverednode);
        }
    } else if (key === 88) { // X press
        if (np.edgestretchloop) {
            np.cancelEdge();
        } else if (np.hoverednode) {
            np.removeNode(np.hoverednode);
        }
    } else if (49 <= key && key <= 54) { // 1-6 press
        if (np.hoverednode) {
            np.fillNode(palette[key]);
        } else {
            np.setCurrentColor(palette[key]);
            document.querySelector('#infobox').setAttribute('style', 'background-color:' + palette[key]);
        }
    } else if (key === 67) { // C press
        np.clear();
    }
}
