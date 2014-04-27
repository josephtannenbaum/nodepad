nodepad
=======
Graph and tree sketchpad environment webapp written in Javascript
- [Demo here](http://tannenbau.me/nodepad/)<br />

##### Libraries used
- [Snap.svg](http://snapsvg.io/)<br />
- [jGrowl](https://github.com/stanlemon/jGrowl)<br />
- [canvg](http://canvg.googlecode.com)<br />

##### Objects
- `Nodepad`: namespace for the sketchpad
- `Node`: object encapsulating information about a node and operations on it
- `Edge`: object encapsulating information about an edge and operations on it

##### Side menu
- <b>Presets</b>: clears the screen and draws a preset graph (binary tree etc)
- <b>Algorithms</b>: runs a classic algorithm on an existing graph
- <b>Tools</b>: Export graph into different formats, organize nodes 

##### TODO
- Implement directed edges
- "Mathematical" visual theme (smaller nodes and thinner edges, more like LaTeX
- Advanced settings page to expose some variables
