import React, { Component, Fragment } from "react";

import { Node } from "./Node.js";
import { Draggable } from "./Draggable.js";
import { bfs } from "./algorithims/bfs";
import { dijkstra } from "./algorithims/dijkstra";
import { astar } from "./algorithims/astar";
import { makeSingleGenerator } from "./utility/Generator";

import "./css/grid.css";
import "./css/main.css";
import "./css/algowidget.css";

const GRID_WIDTH = Math.max(40, (window.innerWidth - 300) / 30);
const GRID_HEIGHT = Math.max(25, (window.innerHeight - 50) / 30);

const DEFAULT_START_ROW = 14;
const DEFAULT_START_COL = 10;
const DEFAULT_FINISH_ROW = 14;
const DEFAULT_FINISH_COL = 30;

let start_row = DEFAULT_START_ROW;
let start_col = DEFAULT_START_COL;
let finish_row = DEFAULT_FINISH_ROW;
let finish_col = DEFAULT_FINISH_COL;

const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

function* visualizeDijkstra(rclass) {
  rclass.clearPath();
  yield delay(100);

  const newGrid = rclass.state.array.slice();

  let visitedNodes = dijkstra(newGrid[start_row][start_col], newGrid);
  let count = 0;
  //Loop through the nodes
  for (let i = 0; i < visitedNodes.length; i++) {
    let newNode = {
      ...visitedNodes[i],
      visited: true
    };
    count++;

    //Flag visited nodes for update
    newGrid[newNode.row][newNode.col] = newNode;

    if (count % 4 === 0) {
      //Ascynhrously Update state
      yield delay(50);
      requestAnimationFrame(() => {
        rclass.setState({ array: newGrid });
      });
    }
  }

  if (visitedNodes[visitedNodes.length - 1].isFinish) {
    let current = visitedNodes[visitedNodes.length - 1];

    while (current.row !== start_row || current.col !== start_col) {
      let newNode = {
        ...current,
        path_visited: true
      };

      newGrid[newNode.row][newNode.col] = newNode;
      yield delay(50);
      rclass.setState({ array: newGrid });

      current = current.previous;
    }
  }

  rclass.setState({ isSearching: false });
}

function* visualizeAstar(rclass) {
  rclass.clearPath();
  yield delay(100);

  const newGrid = rclass.state.array.slice();

  let count = 0;
  let visitedNodes = astar(
    newGrid[start_row][start_col],
    newGrid[finish_row][finish_col],
    newGrid
  );

  //Loop through the nodes
  for (let i = 0; i < visitedNodes.length; i++) {
    let newNode = {
      ...visitedNodes[i],
      visited: true
    };
    count++;

    //Flag visited nodes for update
    newGrid[newNode.row][newNode.col] = newNode;

    if (count % 4 === 0) {
      //Ascynhrously Update state
      yield delay(50);
      requestAnimationFrame(() => {
        rclass.setState({ array: newGrid });
      });
    }
  }

  if (visitedNodes[visitedNodes.length - 1].isFinish) {
    let current = visitedNodes[visitedNodes.length - 1];

    while (current.row !== start_row || current.col !== start_col) {
      let newNode = {
        ...current,
        path_visited: true
      };

      newGrid[newNode.row][newNode.col] = newNode;
      yield delay(50);
      rclass.setState({ array: newGrid });

      current = current.previous;
    }
  }
  rclass.setState({ isSearching: false });
}

function* visualizeBFS(rclass) {
  rclass.clearPath();
  yield delay(100);

  const newGrid = rclass.state.array.slice();

  let orderedGroups = bfs(newGrid[start_row][start_col], newGrid);
  let lastNode = null;

  //Loop through the nodes in each level of bfs
  for (let i = 0; i < orderedGroups.length; i++) {
    for (let orderedNode of orderedGroups[i]) {
      let newNode = {
        ...orderedNode,
        visited: true
      };

      //Flag visited nodes for update
      newGrid[newNode.row][newNode.col] = newNode;
      lastNode = newNode;
    }

    //Update state
    //Do this once you flagged all nodes in the level
    yield delay(50);
    requestAnimationFrame(() => {
      rclass.setState({ array: newGrid });
    });
  }

  if (lastNode.isFinish) {
    let current = lastNode;

    while (current.row !== start_row || current.col !== start_col) {
      let newNode = {
        ...current,
        path_visited: true
      };

      newGrid[newNode.row][newNode.col] = newNode;
      yield delay(50);
      rclass.setState({ array: newGrid });

      current = current.previous;
    }
  }
  rclass.setState({ isSearching: false });
}

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
      lmbDown: false,
      rmbDown: false,
      selectedObject: "none", //Enum Types: wall, start, finish,
      activeAlgo: "astar",
      isSearching: false
    };
  }

  componentDidMount() {
    this.setState({ array: this.initGrid() });
  }

  visualizeAstar = makeSingleGenerator(this, visualizeAstar);
  visualizeDijkstra = makeSingleGenerator(this, visualizeDijkstra);
  visualizeBFS = makeSingleGenerator(this, visualizeBFS);
  runSearch = this.visualizeAstar;

  // Using setTimeout for delaying state update is fine for now, but
  // may want to look into using async/await
  /*
  visualizeBFS() {
    const newGrid = this.state.array.slice();

    let orderedGroups = bfs(newGrid[start_row][start_col], newGrid);

    //Loop through the nodes in each level of bfs
    for (let i = 0; i < orderedGroups.length; i++) {
      for (let orderedNode of orderedGroups[i]) {
        let newNode = {
          ...orderedNode,
          visited: true
        };

        //Flag visited nodes for update
        setTimeout(() => {
          newGrid[newNode.row][newNode.col] = newNode;
        }, 100 * i);
      }

      //Update state
      //Do this once you flagged all nodes in the level
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.setState({ array: newGrid });
        });
      }, 100 * i);
    }

    setTimeout(() => {
      this.visualizePath(newGrid[finish_row][finish_col]);
    }, 250 * orderedGroups.length + 1);
  }

  async visualizeDijkstra() {
    const newGrid = this.state.array.slice();

    let visitedNodes = dijkstra(newGrid[start_row][start_col], newGrid);
    let count = 0;
    //Loop through the nodes
    for (let i = 0; i < visitedNodes.length; i++) {
      let newNode = {
        ...visitedNodes[i],
        visited: true
      };
      count++;
      //Flag visited nodes for update

      newGrid[newNode.row][newNode.col] = newNode;

      if (count % 1 == 0) {
        //Ascynhrously Update state
        await delay(5).then(p => {
          requestAnimationFrame(() => {
            this.setState({ array: newGrid });
          });
        });
      }
    }

    this.visualizePath(newGrid[finish_row][finish_col]);
  }

  visualizeAstar() {
    const newGrid = this.state.array.slice();

    let visitedNodes = astar(
      newGrid[start_row][start_col],
      newGrid[finish_row][finish_col],
      newGrid
    );

    //Loop through the nodes
    for (let i = 0; i < visitedNodes.length; i++) {
      let newNode = {
        ...visitedNodes[i],
        visited: true
      };

      //Flag visited nodes for update
      //Do this faster than stae update
      setTimeout(() => {
        newGrid[newNode.row][newNode.col] = newNode;
      }, 20 * i);

      //Update state
      //Do this once you flagged all nodes in the level
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.setState({ array: newGrid });
        });
      }, 50 * i);
    }

    setTimeout(() => {
      this.visualizePath(newGrid[finish_row][finish_col]);
    }, 50 * visitedNodes.length);
  }

  visualizePath(current) {
    const newGrid = this.state.array.slice();
    let count = 0;

    while (current.row !== start_row || current.col !== start_col) {
      let newNode = {
        ...current,
        path_visited: true
      };

      setTimeout(() => {
        newGrid[newNode.row][newNode.col] = newNode;
        this.setState({ array: newGrid });
      }, 100 * ++count);

      current = current.previous;
    }
  }
  */

  handleMouseDown(row, col, val) {
    if (this.state.lmbDown || this.state.rmbDown) return;

    if (val === 0) {
      if (this.state.array[row][col].isStart) {
        this.setState({ selectedObject: "start", lmbDown: true });
        return;
      }

      if (this.state.array[row][col].isFinish) {
        this.setState({ selectedObject: "finish", lmbDown: true });
        return;
      }

      let toggledGrid = this.toggleWallOn(row, col, this.state.array);
      this.setState({ array: toggledGrid, lmbDown: true });
    }

    if (val === 2) {
      let toggledGrid = this.toggleWallOff(row, col, this.state.array);
      this.setState({ array: toggledGrid, rmbDown: true });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.lmbDown && !this.state.rmbDown) return;

    if (this.state.selectedObject === "start") {
      let editedGrid = this.moveStart(row, col, this.state.array);
      this.setState({ array: editedGrid });
      return;
    }

    if (this.state.selectedObject === "finish") {
      let editedGrid = this.moveFinish(row, col, this.state.array);
      this.setState({ array: editedGrid });
      return;
    }

    if (this.state.lmbDown) {
      let toggledGrid = this.toggleWallOn(row, col, this.state.array);
      this.setState({ array: toggledGrid });
    }

    if (this.state.rmbDown) {
      let toggledGrid = this.toggleWallOff(row, col, this.state.array);
      this.setState({ array: toggledGrid });
    }
  }

  handleMouseUp(row, col) {
    this.setState({ selectedObject: "none", lmbDown: false, rmbDown: false });
  }

  moveStart(row, col, grid) {
    const newGrid = grid.slice();
    if (!newGrid[row][col].isFinish) {
      newGrid[start_row][start_col].isStart = false;
      newGrid[row][col].isStart = true;
      start_row = row;
      start_col = col;
    }

    return newGrid;
  }

  moveFinish(row, col, grid) {
    const newGrid = grid.slice();
    if (!newGrid[row][col].isStart) {
      newGrid[finish_row][finish_col].isFinish = false;
      newGrid[row][col].isFinish = true;
      finish_row = row;
      finish_col = col;
    }

    return newGrid;
  }

  toggleWallOn(row, col, grid) {
    const newGrid = grid.slice();
    newGrid[row][col].isWall = true;
    return newGrid;
  }

  toggleWallOff(row, col, grid) {
    const newGrid = grid.slice();
    newGrid[row][col].isWall = false;
    return newGrid;
  }

  setAlgorithim(val) {
    this.setState({ activeAlgo: val });

    if (val === "astar") {
      this.runSearch = this.visualizeAstar;
    } else if (val === "dijkstra") {
      this.runSearch = this.visualizeDijkstra;
    } else if (val === "bfs") {
      this.runSearch = this.visualizeBFS;
    }
  }

  startSearch() {
    this.setState({ isSearching: true });
    this.runSearch(this);
  }

  cancelSearch() {
    this.setState({ isSearching: false });
  }

  //Initialize Grid
  initGrid = () => {
    const arr = [];
    for (let row = 0; row < GRID_HEIGHT; row++) {
      const currRow = [];
      for (let col = 0; col < GRID_WIDTH; col++) {
        currRow.push(this.genNode(row, col));
      }
      arr.push(currRow);
    }
    return arr;
  };

  //Remove all walls from grid
  clearWalls() {
    this.setState({ array: this.initGrid() });
  }

  clearPath() {
    let newGrid = this.state.array.slice();
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        newGrid[i][j].visited = false;
        newGrid[i][j].path_visited = false;
      }
    }

    this.setState({ array: newGrid });
  }

  //Reset the grid
  resetGrid() {
    start_row = DEFAULT_START_ROW;
    start_col = DEFAULT_START_COL;
    finish_row = DEFAULT_FINISH_ROW;
    finish_col = DEFAULT_FINISH_COL;

    this.setState({ array: this.initGrid() });
  }

  //Generate Node Object
  genNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === start_row && col === start_col,
      isFinish: row === finish_row && col === finish_col,
      isWall: false,
      visited: false,
      path_visited: false,
      previous: null
    };
  };

  render() {
    return (
      <Fragment>
        <div className="wrapper">
          <Draggable initialPos={{ x: 1300, y: 40 }}>
            <h1>Pathfinding Visualizer</h1>
            <header>
              <h2 className="sub-title">Select Algorithim</h2>
            </header>

            <div className="options">
              <label
                className={`option-title ${
                  this.state.isSearching ? "disabled" : ""
                }`}
              >
                <input
                  type="radio"
                  name="algorithim"
                  value="astar"
                  defaultChecked
                  disabled={this.state.isSearching}
                  onChange={e => this.setAlgorithim(e.target.value)}
                ></input>
                Astar
              </label>
              <br></br>

              <label
                className={`option-title ${
                  this.state.isSearching ? "disabled" : ""
                }`}
              >
                <input
                  type="radio"
                  name="algorithim"
                  value="dijkstra"
                  disabled={this.state.isSearching}
                  onChange={e => this.setAlgorithim(e.target.value)}
                ></input>
                Dijkstra
              </label>
              <br></br>

              <label
                className={`option-title ${
                  this.state.isSearching ? "disabled" : ""
                }`}
              >
                <input
                  type="radio"
                  name="algorithim"
                  value="bfs"
                  disabled={this.state.isSearching}
                  onChange={e => this.setAlgorithim(e.target.value)}
                ></input>
                Breadth First Search
              </label>
            </div>
          </Draggable>

          <Draggable initialPos={{ x: 1275, y: 325 }}>
            <button className="bu" onClick={() => this.startSearch()}>
              Start Search
            </button>
            <button
              className="bu"
              onClick={() =>
                this.state.isSearching ? this.cancelSearch() : this.clearPath()
              }
            >
              {this.state.isSearching ? "Cancel Search" : "Clear Path"}
            </button>
            <button
              className="bu"
              disabled={this.state.isSearching}
              onClick={() => this.clearWalls()}
            >
              Clear Walls
            </button>
            <button
              className="bu"
              disabled={this.state.isSearching}
              onClick={() => this.resetGrid()}
            >
              Reset
            </button>
          </Draggable>

          <div className="board">
            {this.state.array.map((row, ridx) => (
              <div className="grid-row">
                {row.map((node, cidx) => (
                  <Node
                    row={node.row}
                    col={node.col}
                    isStart={node.isStart}
                    isFinish={node.isFinish}
                    isWall={node.isWall}
                    visited={node.visited}
                    path_visited={node.path_visited}
                    onMouseDown={(row, col, val) =>
                      this.handleMouseDown(row, col, val)
                    }
                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                    onMouseUp={() => this.handleMouseUp()}
                  >
                    {/*{node.row + "," + node.col}*/}
                  </Node>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    );
  }
}

export { Grid };
