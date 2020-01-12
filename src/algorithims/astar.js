import PriorityQueue from "../utility/PriorityQueue";

export function astar(startNode, targetNode, grid) {
  const queue = new PriorityQueue(
    (a, b) =>
      cost[a.row][a.col] + manhattanDistance(a, targetNode) <=
      cost[b.row][b.col] + manhattanDistance(b, targetNode)
  );

  let cost = Array(grid.length)
    .fill(0)
    .map(n => new Array(grid[0].length).fill(null));

  cost[startNode.row][startNode.col] = 0;

  let visited = [];

  queue.push(startNode);

  while (!queue.isEmpty()) {
    let curr = queue.pop();

    visited.push(curr);

    //Early exit
    if (curr.isFinish) {
      return visited;
    }

    let nextNodes = getNeighbors(curr, grid);

    for (const node of nextNodes) {
      let new_cost = cost[curr.row][curr.col] + 1;
      if (
        (node.isFinish || !node.isWall) &&
        (cost[node.row][node.col] == null ||
          new_cost < cost[node.row][node.col])
      ) {
        cost[node.row][node.col] = new_cost;
        node.previous = curr;
        queue.push(node);
      }
    }
  }

  return visited;
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  //Up
  if (row > 0) neighbors.push(grid[row - 1][col]);
  //Down
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  //Left
  if (col > 0) neighbors.push(grid[row][col - 1]);
  //Right
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

//Hueristics
function manhattanDistance(start, end) {
  return Math.abs(start.row - end.row) + Math.abs(start.col - end.col);
}
