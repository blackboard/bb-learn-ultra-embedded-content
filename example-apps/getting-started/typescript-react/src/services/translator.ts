import { configureTranslator } from 'bb-public-library/utilities'; /* tslint:disable-line no-implicit-dependencies */
import locales from '../locales';

const translator = configureTranslator(locales);

export default translator;
