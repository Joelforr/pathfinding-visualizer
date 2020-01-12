class Queue {
  constructor() {
    this.items = [];
  }

  enqueue = element => {
    //add tp queue
    this.items.push(element);
  };

  dequeue = () => {
    if (this.isEmpty()) return "null";
    return this.items.shift();
  };

  peek = () => {
    if (this.isEmpty()) return "null";
    return this.item[0];
  };

  isEmpty = () => {
    return this.items.length === 0;
  };

  size = () => {
    return this.items.length;
  };
}

export default Queue;
