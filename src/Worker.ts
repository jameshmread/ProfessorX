
process.on("message", (input) => {
      console.log("hee");
      const x = new Worker(input);
});
export class Worker {
      constructor (input) {
            this.fact(Number(input));
            process.exit(1);
      }
      public fact (value: number) {
            if (value % 2 === 0) {
                  for (let i = 1; i < value; i++) {
                        console.log(process.pid, i);
                  }
            } else {
                  for (let i = value; i > 0; i--) {
                        console.log(process.pid, i);
                  }

            }
      }

}
