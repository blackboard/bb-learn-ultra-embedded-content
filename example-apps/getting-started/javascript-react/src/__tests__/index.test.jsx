describe('Index file', () => {
    let someValue = null;

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
