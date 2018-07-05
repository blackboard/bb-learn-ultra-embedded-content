import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
// NOTE: Order matters for these css files
// ...the latter will overwrite the former
import './styles/tailwind/styles.css';
import '../../../library/styles/index.scss';
import './styles/index.scss';

ReactDOM.render(
    <App />,
    document.getElementById('app'),
);
