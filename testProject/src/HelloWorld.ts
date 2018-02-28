export class HelloWorld {
    public addNumbers (a: number, b: number) {
        return a + b;
    }

    public add3Numbers (a: number, b: number, c: number) {
        return a + b + c;
    }

    public takeAway (a: number, b: number) {
        return a - b;
    }

    public truth () {
        return true;
    }

    public helloStrings (h: string, w: string) {
        return h + w;
    }

    public helloStringLiteral () {
        return "hello: " + "1";
    }

    public percentage (b: number, c: number) {
        return (b / c) * 100;
    }
}
