// https://musing-rosalind-2ce8e7.netlify.com/?machine=%7B%22initial%22%3A%22summoning%20sickness%22%2C%22states%22%3A%7B%22summoning%20sickness%22%3A%7B%22onEntry%22%3A%5B%22tap%22%5D%2C%22on%22%3A%7B%22START_TURN%22%3A%22ready%22%7D%7D%2C%22ready%22%3A%7B%22onEntry%22%3A%5B%22untap%22%5D%2C%22on%22%3A%7B%22ATTACK%22%3A%22tapped%22%2C%22ABILIITY%22%3A%7B%22tapped%22%3A%7B%22cond%22%3A%22abilityCostPaid%22%7D%7D%7D%7D%2C%22tapped%22%3A%7B%22on%22%3A%7B%22START_TURN%22%3A%22ready%22%7D%7D%7D%7D
import React, { Component } from "react";
import { render } from "react-dom";
import { Machine } from "xstate";
import styled, { injectGlobal } from "styled-components";
import Card from "./Card";

const state = {
  initial: "summoning sickness",
  states: {
    "summoning sickness": {
      on: {
        START_TURN: "untapped"
      }
    },
    untapped: {
      on: {
        ATTACK: "tapped",
        ABILIITY: {
          tapped: {
            cond: "abilityCostPaid",
            actions: ["removeManaFromPool", "doSomething"]
          }
        }
      }
    },
    tapped: {
      on: {
        START_TURN: "untapped"
      }
    }
  }
};

const guards = {
  abilityCostPaid: ({ required, pool }) =>
    Object.entries(required).every(([color, amount]) => pool[color] >= amount)
};

const machine = Machine(state, { guards });

injectGlobal`
  body {
    margin: 0;
  }
`;

const PlayArea = styled.main`
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: 100vh;
  background-color: beige;

  & > *:first-child {
    justify-self: center;
    align-self: center;
  }

  & > *:last-child {
    padding: 1em;
  }
`;

const ManaPool = styled.footer`
  display: flex;
  justify-content: space-around;
`;

const Mana = styled.button.attrs({
  type: "button"
})`
  background: lightgrey;
  border: none;
  border-radius: 50%;
  height: 5em;
  width: 5em;
`;

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentState: machine.initialState,
      opponent: 20,
      mana: {
        white: 0,
        blue: 0,
        black: 0,
        red: 0,
        green: 0,
        colorless: 0
      }
    };
    this.addWhite = this.add.bind(this, "white");
    this.addBlue = this.add.bind(this, "blue");
    this.addBlack = this.add.bind(this, "black");
    this.addRed = this.add.bind(this, "red");
    this.addGreen = this.add.bind(this, "green");
    this.addColorless = this.add.bind(this, "colorless");
    this.tap = this.tap.bind(this);
    this.attack = this.attack.bind(this);
    this.startTurn = this.startTurn.bind(this);
    this.ability = this.ability.bind(this);
    this.removeManaFromPool = this.removeManaFromPool.bind(this);
    this.doSomething = this.doSomething.bind(this);
  }

  startTurn() {
    const nextState = machine.transition(this.state.currentState, "START_TURN");
    this.setState({ currentState: nextState }, () => {
      this.state.currentState.actions.forEach(action => this[action]());
    });
  }

  attack() {
    const nextState = machine.transition(this.state.currentState, "ATTACK");
    this.setState({ currentState: nextState }, () => {
      this.state.currentState.actions.forEach(action => this[action]());
    });
  }

  ability(event) {
    event.stopPropagation();
    const nextState = machine.transition(this.state.currentState, "ABILIITY", {
      required: {
        red: 2,
        green: 1,
        colorless: 1
      },
      pool: {
        ...this.state.mana
      }
    });
    this.setState({ currentState: nextState }, () => {
      this.state.currentState.actions.forEach(action => this[action]());
    });
  }

  tap() {
    const nextState = machine.transition(this.state.currentState, "TAP");
    this.setState({ currentState: nextState }, () => {
      this.state.currentState.actions.forEach(action => this[action]());
    });
  }

  removeManaFromPool() {
    this.setState(prevState => ({
      ...prevState,
      mana: {
        ...prevState.mana,
        red: prevState.mana.red - 2,
        green: prevState.mana.green - 1,
        colorless: prevState.mana.colorless - 1
      }
    }));
  }

  doSomething() {
    this.setState(prevState => ({
      ...prevState,
      opponent: prevState.opponent - 4
    }));
  }

  add(type) {
    this.setState(prevState => ({
      ...prevState,
      mana: {
        ...prevState.mana,
        [type]: prevState.mana[type] + 1
      }
    }));
  }

  componentDidMount() {
    this.state.currentState.actions.forEach(action => this[action]());
  }

  render() {
    return (
      <PlayArea>
        <section>
          <div>Opponent's HP {this.state.opponent}</div>
          <Card status={this.state.currentState.value} onClick={this.attack}>
            <button type="button" onClick={this.ability}>
              Ability
            </button>
          </Card>
          <button type="button" onClick={this.startTurn}>
            Start Turn
          </button>
        </section>
        <ManaPool>
          <Mana onClick={this.addWhite}>{`white: ${
            this.state.mana.white
          }`}</Mana>
          <Mana onClick={this.addBlue}>{`blue: ${this.state.mana.blue}`}</Mana>
          <Mana onClick={this.addBlack}>{`black: ${
            this.state.mana.black
          }`}</Mana>
          <Mana onClick={this.addRed}>{`red: ${this.state.mana.red}`}</Mana>
          <Mana onClick={this.addGreen}>{`green: ${
            this.state.mana.green
          }`}</Mana>
          <Mana onClick={this.addColorless}>{`colorless: ${
            this.state.mana.colorless
          }`}</Mana>
        </ManaPool>
      </PlayArea>
    );
  }
}

render(<App />, document.getElementById("root"));
