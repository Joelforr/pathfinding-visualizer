import React, { Component } from "react";

import "./css/node.css";

class Node extends Component {
  mouseOverFunc(row, col) {
    console.log(`${row} , ${col}`);
  }

  render() {
    const {
      row,
      col,
      isFinish,
      isStart,
      isWall,
      path_visited,
      visited,
      onMouseDown,
      onMouseEnter,
      onMouseUp
    } = this.props;

    const extraClassType = isStart
      ? "node-start"
      : isFinish
      ? "node-finish"
      : isWall
      ? "node-wall"
      : path_visited
      ? "node-path-visited"
      : visited
      ? "node-visited"
      : "";

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassType}`}
        onMouseDown={e => {
          onMouseDown(row, col, e.button);
        }}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
        onContextMenu={e => e.preventDefault()}
      >
        {this.props.children}
      </div>
    );
  }
}

export { Node };
