
process.on("message", (input) => {
      const x = new Worker(input);
});
export class Worker {
      constructor (input) {
            process.exit(1);
      }
}
