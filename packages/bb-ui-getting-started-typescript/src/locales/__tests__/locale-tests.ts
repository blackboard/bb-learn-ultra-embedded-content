import * as fs from 'fs';
import config from '../index'; // tslint:disable-line

describe('locale tests', () => {
    it('loads every translation file', () => {
        const root = `${__dirname}/..`;
        fs.readdirSync(root)
            .filter((it: string) => fs.lstatSync(`${root}/${it}`).isDirectory())
            .filter((it: string) => it !== '__tests__')
            .forEach((it: string) => expect(config[it]).not.toBeUndefined());
    });
});
