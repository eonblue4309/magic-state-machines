// https://musing-rosalind-2ce8e7.netlify.com/?machine=%7B%22initial%22%3A%22summoning%20sickness%22%2C%22states%22%3A%7B%22summoning%20sickness%22%3A%7B%22onEntry%22%3A%5B%22tap%22%5D%2C%22on%22%3A%7B%22START_TURN%22%3A%22ready%22%7D%7D%2C%22ready%22%3A%7B%22onEntry%22%3A%5B%22untap%22%5D%2C%22on%22%3A%7B%22ATTACK%22%3A%22tapped%22%2C%22ABILIITY%22%3A%7B%22tapped%22%3A%7B%22cond%22%3A%22abilityCostPaid%22%7D%7D%7D%7D%2C%22tapped%22%3A%7B%22on%22%3A%7B%22START_TURN%22%3A%22ready%22%7D%7D%7D%7D
import React, { Component } from "react";
import { render } from "react-dom";
import { Machine } from "xstate";
import styled, { injectGlobal } from "styled-components";

const state = {
  initial: "summoning sickness",
  states: {
    "summoning sickness": {
      onEntry: ["tap"],
      on: {
        START_TURN: "ready"
      }
    },
    ready: {
      onEntry: ["untap"],
      on: {
        ATTACK: "tapped",
        ABILIITY: {
          tapped: {
            cond: "abilityCostPaid",
            actions: ["removeManaFromPool"]
          }
        }
      }
    },
    tapped: {
      on: {
        START_TURN: "ready"
      }
    }
  }
};

const guards = {
  abilityCostPaid: (required, pool) => true
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

const Card = styled.div`
  height: 350px;
  width: 230px;
  border: 5px solid black;
  border-radius: 5px;
  background-color: white;
`;

const ManaPool = styled.footer`
  display: flex;
  justify-content: space-around;
`;

const Mana = styled.button`
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
      mana: {
        white: 0,
        blue: 0,
        black: 0,
        red: 0,
        green: 0,
        colorless: 0
      }
    };
  }

  render() {
    return (
      <PlayArea>
        <section>
          <Card />
        </section>
        <ManaPool>
          {Object.entries(this.state.mana).map(([type, amount]) => (
            <Mana type="button">{`${type}: ${amount}`}</Mana>
          ))}
        </ManaPool>
      </PlayArea>
    );
  }
}

render(<App />, document.getElementById("root"));
