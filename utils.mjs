export class Counter {
  constructor(index) {
    this.i = index
  }
  increment = () => ++this.i
  report = () => this.i
}
