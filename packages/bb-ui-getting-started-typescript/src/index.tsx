import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/app';
// NOTE: Order matters for these css files
// ...the latter will overwrite the former
import './styles/tailwind/styles.css';
import '../../bb-library-ui-components/styles/index.scss';
import './styles/index.scss';

ReactDOM.render(
    <App title="Hello, content provider!" />,
    document.getElementById('app'),
);
