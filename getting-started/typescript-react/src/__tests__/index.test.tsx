describe('Index file', () => {
    let someValue: string = null;

    beforeEach(() => {
        someValue = 'Hello, Test!';
    });

    afterEach(() => {
        someValue = null;
    });

    it('should do something...', () => {
        expect(someValue).toBe('Hello, Test!');
    });
});
