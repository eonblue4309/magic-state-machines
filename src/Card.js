import React from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from { 
    transform: rotate(0deg) translate(-50%, -50%);
  }
  to {
    transform: rotate(360deg) translate(-50%, -50%);
  }
`;

const Card = styled.div`
  height: 350px;
  width: 230px;
  border: 5px solid black;
  border-radius: 5px;
  background-color: white;
  transition: all 250ms ease;
  position: relative;

  &[data-status="summoning sickness"] {
    & ::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 5px solid green;
      border-bottom-color: transparent;
      border-radius: 2em;
      height: 3em;
      width: 3em;
      animation: ${rotate} 1s linear infinite;
      transform-origin: top left;
    }
  }

  &[data-status="tapped"] {
    transform: rotate(90deg);
  }

  & > button {
    align-self: flex-end;
  }
`;

export default ({ status, ...props }) => (
  <Card data-status={status} {...props} />
);
