import * as React from 'react';
import { Card } from 'react-bootstrap';
import { Core, ElementDefinition } from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import Mousetrap, { ExtendedKeyboardEvent } from 'mousetrap';

import './App.css';

class App extends React.Component {
  cy?: Core;
  mouseX = 0;
  mouseY = 0;
  state: {
    elements: ElementDefinition[];
  } = { elements: [] };

  PALETTE = {
    49: '#bada55',
    50: '#C14C44',
    51: '#da55ba',
    52: '#c89dbf',
    53: '#dab855',
    54: '#55bada',
    55: '#fff'
  };

  constructor (props: any) {
    super(props);
    Mousetrap.bind('z', this._onKeyDown.bind(this));
  }

  _onKeyDown (e: ExtendedKeyboardEvent) {
    this.setState({
      elements: [...this.state.elements, {
        data: { }, position: { x: this.mouseX, y: this.mouseY }
      }]
    });
  }

  render () {
    return (
      <div className="App">
        <CytoscapeComponent
          elements={this.state.elements}
          style={ { width: '100%', height: '100vh', display: 'block' } }

          stylesheet={[
            {
              selector: 'node',
              style: {
                width: 50,
                height: 50,
                backgroundColor: this.PALETTE[49],
                "border-width": 3
              }
            },
            {
              selector: 'edge',
              style: {
                width: 15
              }
            }
          ]}

          cy={(cy) => {
            this.cy = cy;
            this.cy?.on('mousemove', (e) => {
              this.mouseX = e.position.x;
              this.mouseY = e.position.y;
            });
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

          <Card.Text>D: Directed edges on/off</Card.Text>

          <Card.Text>1-7: change new node color</Card.Text>

          <Card.Text>HOVER + [1-7] to change a node's color</Card.Text>

          <Card.Text>CTRL +/- to zoom in/out</Card.Text>
          <Card.Link href="https://github.com/josephtannenbaum/nodepad">Source on GitHub</Card.Link>
        </Card>

      </div>
    );
  }
}

export default App;


