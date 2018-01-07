export class FileTwo {
    public getEvenNumbers (limit: number) {
        const numbers = [];
        for (let i = 0; i < limit + 1; i++) {
            if (i % 2 === 0){
                numbers.push(i);
            }
        }
        return numbers;
    }
}
