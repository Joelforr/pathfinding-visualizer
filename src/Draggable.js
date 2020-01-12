import React, { Component } from "react";
import { findDOMNode } from "react-dom";

import "./css/draggable.css";

class Draggable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pos: props.initialPos,
      dragging: false,
      rel: null
    };
  }

  componentDidMount() {}

  componentDidUpdate(props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseup", this.onMouseUp);
    }
  }

  onMouseDown = e => {
    if (e.button !== 0) return;

    var element = findDOMNode(this);

    this.setState({
      dragging: true,
      rel: {
        x: e.pageX - element.offsetLeft,
        y: e.pageY - element.offsetTop
      }
    });

    e.stopPropagation();
    e.preventDefault();
  };

  onMouseUp = e => {
    this.setState({ dragging: false });

    e.stopPropagation();
    e.preventDefault();
  };

  onMouseMove = e => {
    if (!this.state.dragging) return;

    this.setState({
      pos: {
        x: e.pageX - this.state.rel.x,
        y: e.pageY - this.state.rel.y
      }
    });

    e.stopPropagation();
    e.preventDefault();
  };
  render() {
    return (
      <div
        className={`my-draggable`}
        style={{ left: `${this.state.pos.x}px`, top: `${this.state.pos.y}px` }}
        onMouseDown={e => this.onMouseDown(e)}
      >
        {this.props.children}
      </div>
    );
  }
}

export { Draggable };
