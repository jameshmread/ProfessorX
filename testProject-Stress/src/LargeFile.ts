export class LargeFile {
    public add100Numbers () {
        const a = 1;
        const b = 1;
        return a + b + a + b + a + b + a + b + a + b +
        a + b + a + b + a + b + a + b + a + b +
        a + b + a + b + a + b + a + b + a + b +
        a + b + a + b + a + b + a + b + a + b +
        a + b + a + b + a + b + a + b + a + b +
        a + b + a + b + a + b + a + b + a + b +
        a + b + a + b + a + b + a + b + a + b +
        a + b + a + b + a + b + a + b + a + b +
        a + b + a + b + a + b + a + b + a + b +
        a + b + a + b + a + b + a + b + a + b;
    }

    public moreComplexExpression () {
        const a = 1;
        const b = 1;
        const firstNumber =
        a + b - a / b * a * b + a + b + a + b +
        a + b + a + b - a - b - a + b + a + b +
        a / b / a / b;
        let secondNumber = 0;
        for (let i = 0; i < 2000; i++) {
            if (i % 10 === 0) {
                secondNumber ++;
            }
            if (i % 5 === 0 && true) {
                secondNumber *= 3;
            } else {
                secondNumber --;
            }
        }
        return firstNumber > secondNumber;
    }

    public return0 () {
        const a = 1;
        const b = 2;
        return  (a + b - a / b * a * b + a + b + a + b +
        a + b + a + b - a - b - a + b + a + b +
        a + b + a + b - a - b - a + b / a + b +
        a + b + a + b - a - b - a + b / a + b +
        a + b + a + b - a - b - a + b / a + b +
        a + b + a + b - a - b - a + b / a + b +
        a + b + a + b - a - b - a + b / a + b +
        a + b + a + b - a - b - a + b / a + b +
        a + b + a + b - a - b - a + b / a + b +
        a + b + a + b - a - b - a + b / a + b +
        a + b + a + b - a - b - a + b + a + b +
        a + b + a + b - a - b - a + b + a + b +
        a + b + a + b - a - b - a + b + a + b +
        a + b + a + b - a - b - a + b + a + b +
        a + b + a + b - a - b - a + b + a + b +
        a + b + a + b - a - b - a + b + a + b +
        a + b + a + b - a - b - a + b + a + b +
        a + b + a + b - a - b - a + b + a + b +
        a + b + a + b - a - b - a + b + a + b +
        a + b + a + b - a - b - a + b + a + b +
        a + b + a + b - a - b - a + b + a + b +
        a + b - a / b * a * b + a + b + a + b +
        a / b / a / b) * 0;
    }

    public inputs (a: number, b: number) {
        while (a < b) {
            a++;
        }
        const arrayLength = a + b;
        const array = new Array<number>();
        for (let i = a; i < b * 1000; i++) {
            array.push(i * 2);
        }
        return array[b];
    }
}
