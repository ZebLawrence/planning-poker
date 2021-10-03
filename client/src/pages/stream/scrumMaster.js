import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Button, Badge } from 'reactstrap';
import FlipCard from '../../components/flipCard/flipCard';
import './scrumMaster.scss';

const client = new W3CWebSocket('ws://localhost:8999/');

class ScrumMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
          cardsData: []
        };
        this.flipCards = this.flipCards.bind(this);
        this.resetCards = this.resetCards.bind(this);
    }

    componentDidMount() {
        client.onopen = openMessage => {
            console.log('WebSocket Client Connected', openMessage);
            client.send(JSON.stringify({
              command: 'setUserData',
              data: { isScrumMaster: true }
            }));
        };
        client.onmessage = (message) => {
            const { data: cardsData } = JSON.parse(message.data);
            this.setState({cardsData});
        };
    }
  
    flipCards() {
      const { flipped } = this.state;
      this.setState({ flipped: !flipped });
    }

    resetCards() {
      client.send(JSON.stringify({
        command: 'resetPoints'
      }));
      this.setState({ flipped: false });
    }

    render() {
      const { cardsData, flipped } = this.state;
      let totalPoints = 0;
      let cardsWithScores = 0;
      const cards = cardsData && cardsData.length && cardsData.map((data, index) => {
        const { name, points, image, backgroundColor } = data;
        const flipKey = `${name}-${index}`;
        if (points && !isNaN(points)) {
          totalPoints += Number(points);
          cardsWithScores += 1;
        }
        return (
          <FlipCard
            key={`${flipKey}`}
            image={image}
            flipped={flipped}
            backgroundColor={backgroundColor}
            name={name}
            points={points} />
        );
      });

      let average = totalPoints / (cardsWithScores || 1);
      return (
        <>
          <div className="my-3">
            <h2>
              <Button onClick={this.flipCards}>Flip Cards</Button>
              {flipped && <Badge className="ml-3" color="secondary">{`Average: ${average}`}</Badge>}
              {flipped && <Button className="ml-3" onClick={this.resetCards}>Reset Cards</Button>}
            </h2>
          </div>
          <div className="card-deck">
            {cards}
          </div>
        </>
      );
    }
}

export default ScrumMaster;
