// NOTE: Add additional language dictionary.json files and import them to support localization
import * as en from './en/dictionary.json';

interface ILocalesConfig {
    [key: string]: any;
}

const localesConfig: ILocalesConfig = {
    en,
};

export default localesConfig;
