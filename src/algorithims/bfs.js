import "../utility/Queue";
import Queue from "../utility/Queue";

export function bfs(startNode, grid) {
  var queue = new Queue();
  let seen = Array(grid.length)
    .fill(0)
    .map(n => new Array(grid[0].length).fill(false));

  let groups = [];

  queue.enqueue(startNode);

  while (!queue.isEmpty()) {
    let currLevel = [];
    let size = queue.size();

    while (size > 0) {
      let curr = queue.dequeue();

      if (!seen[curr.row][curr.col]) {
        seen[curr.row][curr.col] = true;
        currLevel.push(curr);

        //Early exit
        if (curr.isFinish) {
          groups.push(currLevel);
          return groups;
        }

        let nextNodes = getNeighbors(curr, grid);

        for (const node of nextNodes) {
          if (!seen[node.row][node.col] && (node.isFinish || !node.isWall)) {
            node.previous = curr;
            queue.enqueue(node);
          }
        }
      }

      size -= 1;
    }
    groups.push(currLevel);
  }

  return groups;
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
