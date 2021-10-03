import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Jumbotron, InputGroup, Input, InputGroupAddon } from 'reactstrap';
import './home.scss';

const client = new W3CWebSocket('ws://localhost:8999/');

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      pointOptions: ['', '?', 1, 2, 3, 5, 8, 13, 21],
      pointIndex: 0,
      cardData: {
        name: '',
        points: ''
      }
    };
    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    client.onopen = openMessage => {
        client.send(JSON.stringify({
          command: 'getUserData'
        }));
    };
    client.onmessage = (message) => {
      console.log('The incoming message', message);
        const { command, data: cardData } = JSON.parse(message.data);
        if (command === 'setDataSuccess') {
          this.setState({cardData});
        }
    };
    if (client.readyState) {
      client.send(JSON.stringify({
        command: 'getUserData'
      }));
    }
  }

  handleInput(inputEvent) {
    const { currentTarget: { value, name } } = inputEvent;
    client.send(JSON.stringify({
      command: 'setUserData',
      data: { [name]: value }
    }));
  }

  render() {
    const { pointIndex, pointOptions, cardData } = this.state;
    const { name, points, image, backgroundColor } = cardData;

    const options = pointOptions.map((item, index) => {
      return (<option selected={item === points} key={item} value={undefined}>{item}</option>);
    });

    return (
      <div className="holdings">
        <Jumbotron>
          <InputGroup size="lg" className="mb-3">
            <InputGroupAddon addonType="prepend">Name</InputGroupAddon>
            <Input name="name" value={name} onChange={this.handleInput} />
          </InputGroup>
          <InputGroup size="lg" className="mb-3">
            <InputGroupAddon addonType="prepend">Points</InputGroupAddon>
            <Input type="select" name="points" id="exampleSelect" onChange={this.handleInput}>
              {options}
            </Input>
          </InputGroup>
          <InputGroup size="lg" className="mb-3">
            <InputGroupAddon addonType="prepend">Card Image</InputGroupAddon>
            <Input placeholder="http://path.to/image.jpg" name="image" value={image} onChange={this.handleInput} />
          </InputGroup>          
          <InputGroup size="lg" className="mb-3">
            <InputGroupAddon addonType="prepend">Card Color</InputGroupAddon>
            <Input type="color" name="backgroundColor" value={backgroundColor} onChange={this.handleInput} />
          </InputGroup>          
        </Jumbotron>
      </div>
    );
  }
}

export default Home;
