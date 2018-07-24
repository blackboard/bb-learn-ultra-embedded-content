import fs from 'fs';
import config from '../index';

describe('locale tests', () => {
    it('loads every translation file', () => {
        const root = `${__dirname}/..`;
        fs.readdirSync(root)
          .filter(it => fs.lstatSync(`${root}/${it}`).isDirectory())
          .filter(it => it !== '__tests__')
          .forEach(it => expect(config[it]).not.toBeUndefined());
    });
});
