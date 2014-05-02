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
    if (!condition) throw message || 'Assertion failed';
}
var mouseX = 0,
    mouseY = 0;
$(document).mousemove(function (e) {
    'use strict';
    mouseX = e.pageX;
    mouseY = e.pageY;
});

function _sidebarToggleDirected(directed) {
    $(directed ? "span#directedon" : "span#directedoff").css({"font-weight": "bold"});
    $(directed ? "span#directedoff" : "span#directedon").css({"font-weight": "none"});
}

var defaultHighlightColor = 'orange',
    defaultEdgeColor = '#000',
    palette = {
    49: '#bada55',
    50: '#C14C44',
    51: '#da55ba',
    52: '#c89dbf',
    53: '#dab855',
    54: '#55bada',
    55: '#fff'
    },
    defaultCurrentColor = palette[49],
    defaultNodeRadius = 36,
    defaultEdgeStrokeWidth = 5,
    defaultNodeStrokeWidth = 4;
    defaultArrowLength = 30,
    defaultArrowStrokeWidth = 4;
var algo_in_progress = false;

function Node(nodegroup, currentfill) {
    this.group = nodegroup;
    this.currentfill = currentfill;
    this.label = nodegroup.select('text').text;
    this.x = nodegroup.getBBox().cx;
    this.y = nodegroup.getBBox().cy;
    this.edges = Snap.set();
    this.outedges = Snap.set();
    this.inedges = Snap.set();
    this.fill = function(fill) {
        this.currentfill = fill;
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
function Edge(line, srcnode, dstnode, arrowgroup) {
    this.line = line;
    this.src = srcnode;
    this.dst = dstnode;
    this.arrowgroup=arrowgroup;
    this.remove = function() {
        this.line.remove();
        if(this.arrowgroup) {
            this.arrowgroup.remove();
            this.arrowgroup=null;
        }
    }
}
function Nodepad(selector) {
    this.s = Snap(selector);
    this.nodes = Snap.set();
    this.edges = Snap.set();
    this.fullgroup = null;
    this.currentfill = defaultCurrentColor;
    this.nodecount = 1;
    this.directed=false;
    this.draggingarrowgroup = null;
    
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
        var arrowgroup=null;
        if (this.directed) // set up arrowhead
            arrowgroup = _drawArrowGroup(this, srcnode.x, srcnode.y, dstnode.x, dstnode.y);
        var newedge = new Edge(line, srcnode, dstnode, arrowgroup);
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
        var this_np = this;
        this.edgestretchloop = setInterval(function () {
            var x2 = line.getBBox().x2;
            var y2 = line.getBBox().y2;
            line.attr({
                'x2': x2 + (mouseX - x2),
                'y2': y2 + (mouseY - y2)
            });
            if (this_np.directed) {
                if(this_np.draggingarrowgroup) this_np.draggingarrowgroup.remove();
                this_np.draggingarrowgroup = _drawArrowGroup(this_np, this_np.sourcenode.x, this_np.sourcenode.y, mouseX, mouseY, true);
            }
        }, 5);
    }
    this.cancelEdge = function() {
        if (this.edgestretchloop) clearInterval(this.edgestretchloop);
        if (this.draggingline) this.draggingline.remove();
        if (this.draggingarrowgroup) this.draggingarrowgroup.remove();
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
        // place arrowgroup appropriately
        var arrowhead = null;
        if(this.draggingarrowgroup) {
            this.draggingarrowgroup.remove();
            arrowhead = _drawArrowGroup(this, srcnode.x, srcnode.y, dstnode.x, dstnode.y);
        }
        var newedge = new Edge(this.draggingline, srcnode, dstnode, arrowhead);
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
        var newnode = new Node(nodegroup, this.currentfill);
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
        
        var this_np = this;
        /* node-dragging behavior */
        nodegroup.drag();
        nodegroup.drag(function(dx, dy, x, y, e) { // onmove
            newnode.x = newnode.group.getBBox().cx;
            newnode.y = newnode.group.getBBox().cy;
            newnode.edges.forEach(function (edge) {
                if (edge.src == newnode) { // we're moving the source node
                    edge.line.attr({x1: newnode.x, y1: newnode.y});
                } else { // we're moving the dst node
                    edge.line.attr({x2: newnode.x, y2: newnode.y});
                }
                if (edge.arrowgroup) {
                    edge.arrowgroup.remove();
                    edge.arrowgroup = _drawArrowGroup(this_np, edge.src.x, edge.src.y, edge.dst.x, edge.dst.y);
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
        
        this.directed=false;
        _sidebarToggleDirected(false);
        np.toggleDirected(false);
        this.nodecount = 1;
    }
    this.toggleDirected = function(directed) {
        if (!directed) this.draggingarrowgroup = null;
        this.edges.forEach(function(e) {
           if (e.arrowgroup)
            e.arrowgroup.attr({"display": (directed ? "block" : "none")});
        });
    }
}

var nodepad_keylock = false;
document.onkeydown = function (ev) {
    'use strict';
    assert(np, 'Error: np var not found!');
    if (nodepad_keylock) return;
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
    } else if (49 <= key && key <= 55) { // 1-7 press
        if (np.hoverednode) {
            np.fillNode(palette[key]);
        } else {
            np.setCurrentColor(palette[key]);
            document.querySelector('#infobox').setAttribute('style', 'background-color:' + palette[key]);
        }
    } else if (false && key === 16) { // Shift press
        if(np.fullgroup) return;
        var allgroups = [];
        np.edges.forEach(function(e) {
            if(e.line) allgroups.push(e.line);
        });
        np.nodes.forEach(function(n) {
            if(n.group) allgroups.push(n.group);
            n.group._dragtmp = n.group._drag;
            n.group._drag = function(){};
        });
        if(!allgroups.length) return;
        np.fullgroup = np.s.group.apply(np.s, allgroups);
        np.fullgroup.drag();
    } else if (key === 67) { // C press
        np.clear();
    } else if (key === 68) { // D press
        if (np.draggingline) { // we don't want to switch modes mid-draw
            nodepad_notif("Can't switch DG modes while drawing an edge");
        } else if (algo_armed) {
            nodepad_notif("Can't switch DG modes while there's an algorithm in progress");
        } else {
            np.directed=!np.directed;
            np.toggleDirected(np.directed);
            _sidebarToggleDirected(np.directed);
            nodepad_notif("Directed graph mode turned " + (np.directed ? "on" : "off"));
        }
    }
}

document.onkeyup = function (ev) {
    'use strict';
    assert(np, 'Error: np var not found!');
    if (nodepad_keylock) return;
    var key = (ev || window.event).keyCode;
    if (false && key === 16 && np.fullgroup) { // Shift up
        np.fullgroup.undrag();
        np.fullgroup = null;
        np.nodes.forEach(function(n) {
            n.group._drag = n.group._dragtmp;
        });
    }
}

function _debugArrow(np, x, y){
    var l = np.s.line(0, 0, x, y);
    l.attr({
        stroke: defaultEdgeColor,
        strokeWidth: defaultEdgeStrokeWidth
    });
}

function _drawArrowGroup(np, sx, sy, dx, dy, no_offset) {
    var angle = (Math.atan2((sy - dy),(sx - dx)) * 180) / Math.PI;
    var nodeBoundaryDx = 0;
    var nodeBoundaryDy = 0;
    if(!no_offset) {
        nodeBoundaryDx = defaultNodeRadius*Math.sin((270-angle) * Math.PI / 180);
        nodeBoundaryDy = defaultNodeRadius*Math.cos((270-angle) * Math.PI / 180);
    }
    var leftArrowAngle = (angle + 20);
    var leftArrowLength = defaultArrowLength;
    var leftArrowDy = leftArrowLength*Math.sin((180+leftArrowAngle) * Math.PI / 180);
    var leftArrowDx = leftArrowLength*Math.cos((180+leftArrowAngle) * Math.PI / 180);
    var leftArrowY = dy - leftArrowDy;
    var leftArrowX = dx - leftArrowDx;
    var leftArrowLine = np.s.line(leftArrowX-nodeBoundaryDx, leftArrowY-nodeBoundaryDy, dx-nodeBoundaryDx, dy-nodeBoundaryDy);
    leftArrowLine.attr({stroke: defaultEdgeColor, strokeWidth: defaultArrowStrokeWidth}); 
    var rightArrowAngle = (angle - 20);
    var rightArrowLength = defaultArrowLength;
    var rightArrowDy = rightArrowLength*Math.sin((180+rightArrowAngle) * Math.PI / 180);
    var rightArrowDx = rightArrowLength*Math.cos((180+rightArrowAngle) * Math.PI / 180);
    var rightArrowY = dy - rightArrowDy;
    var rightArrowX = dx - rightArrowDx;
    var rightArrowLine = np.s.line(rightArrowX-nodeBoundaryDx, rightArrowY-nodeBoundaryDy, dx-nodeBoundaryDx, dy-nodeBoundaryDy);
    rightArrowLine.attr({stroke: defaultEdgeColor, strokeWidth: defaultArrowStrokeWidth}); 
    var arrowhead = np.s.group(rightArrowLine, leftArrowLine);
    np.sendToBack(arrowhead);
    return arrowhead;
}
