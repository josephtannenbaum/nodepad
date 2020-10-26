import * as React from 'react';
import { Badge, Card } from 'react-bootstrap';
import { Core, ElementDefinition, Stylesheet } from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import Mousetrap from 'mousetrap';
import './App.css';

const ColorScheme = require('color-scheme');
const scheme = new ColorScheme();
scheme.from_hue(139).scheme('tetrade').variation('hard');
const colors = (scheme.colors() as string[]);
const PALETTE = [0, 5, 9, 13, 3, 7, 12, 16].map(i => `#${colors[i]}`);

class App extends React.Component {
  cy?: Core;
  mouseX = 0;
  mouseY = 0;
  state: {
    elements: ElementDefinition[];
    drawingEdgeId?: string;
    styleDirected: boolean;
    styleNodeColor: string;
  } = {
    elements: [],
    styleDirected: false,
    styleNodeColor: PALETTE[0]
  };

  constructor (props: any) {
    super(props);
    Mousetrap.bind('z', () => {
      const hoveredNode = this.hoveredNodes()?.first();
      if (hoveredNode?.length) {
        if (this.state.drawingEdgeId) {
          this.cy?.add({
            data: { id: Utils.ObjectId(), source: this.state.drawingEdgeId, target: hoveredNode.id() }
          })
          this.state.drawingEdgeId = undefined;
        }
        else {
          this.setState({ drawingEdgeId: hoveredNode.id() });
        }
      }
      else {
        this.cy?.add({
          data: {
            id: Utils.ObjectId() },
            position: { x: this.mouseX, y: this.mouseY },
            style: { backgroundColor: this.state.styleNodeColor }
        });
      }
    });
    Mousetrap.bind('x', () => {
      this.setState({ drawingEdgeId: undefined });
      this.hoveredNodes()?.remove();
    });
    Mousetrap.bind('c', () => {
      this.cy?.elements().remove();
    });
    Mousetrap.bind('d', () => {
      this.setState({ styleDirected: !this.state.styleDirected });
      this.cy?.style(this.getStylesheet());
    });
    Array.from(PALETTE.keys()).forEach(n => {
      // todo: undefined bug?
      Mousetrap.bind(`${n + 1}`, () => {
        const hoveredNode = this.hoveredNodes()?.first();
        if (hoveredNode?.length) {
          hoveredNode.style({ backgroundColor: PALETTE[n] })
        }
        else {
          this.setState({ styleNodeColor: PALETTE[n] });
        }
      });
    })
  }

  getStylesheet (): Stylesheet[] {
    return [
      {
        selector: 'node',
        style: {
          width: 50,
          height: 50,
          "border-width": 3
        }
      },
      {
        selector: 'edge',
        style: {
          width: 4,
          'line-color': 'black',
          'target-arrow-color': 'black',
          'curve-style': 'bezier',
          'target-arrow-shape': this.state.styleDirected ? 'triangle' : 'none'
        }
      }
    ];
  }

  hoveredNodes () {
    return this.cy?.nodes().filter((elem) => {
      const { x1, x2, y1, y2 } = elem.renderedBoundingBox({});
      return x1 < this.mouseX && this.mouseX < x2 && y1 < this.mouseY && this.mouseY < y2;
    });
  }

  render () {
    return (
      <div className="App">
        <CytoscapeComponent
          elements={[]}
          style={ { width: '100%', height: '100vh', display: 'block' } }
          stylesheet={this.getStylesheet()}
          cy={(cy) => {
            this.cy = cy;
            this.cy?.on('mousemove', (e) => {
              this.mouseX = e.position.x;
              this.mouseY = e.position.y;
            });
            cy.on('mouseover', (event) => {
              const container = event.cy.container();
              if (container) {
                container.style.cursor = 'pointer';
              }
            })
            cy.on('mouseout', (event) => {
              const container = event.cy.container();
              if (container) {
                container.style.cursor = 'default';
              }
            })
          }}
          />
        <Card bg="light" style={{ position: 'absolute', right: 0, top: 0, fontSize: '14px', width: '18rem'}} body className="ml-auto mt-3 mr-3">
          <Card.Title>Nodepad</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">by Joe Tannenbaum</Card.Subtitle>

          <Card.Text>Z: Make a node</Card.Text>
          <Card.Text>HOVER+X: Delete a node</Card.Text>
          <Card.Text>HOVER+Z: Start edge, Z again to place edge</Card.Text>
          <Card.Text>Hit X to cancel your edge</Card.Text>
          <Card.Text>C: Clear nodepad</Card.Text>
          <Card.Text>D: Directed edges</Card.Text>
          <Card.Text>
            1-{ PALETTE.length }: new node color <Badge style={{ backgroundColor: this.state.styleNodeColor }}>{ this.state.styleNodeColor }</Badge>
          </Card.Text>
          <Card.Text>HOVER + [1-{ PALETTE.length }] to change a node's color</Card.Text>

          <Card.Link href="https://github.com/josephtannenbaum/nodepad">Source on GitHub</Card.Link>
        </Card>
      </div>
    );
  }
}

export default App;

const Utils = {
  ObjectId: () => {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  }
}
