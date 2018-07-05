import 'raf/polyfill'; // eslint-disable-line import/no-extraneous-dependencies
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
