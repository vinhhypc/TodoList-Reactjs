import React from 'react';
import ReactDOM, {createRoot} from 'react-dom/client';
import './index.css';
import App from './App';
import Index from './components/todo/Index';
import 'bootstrap/dist/css/bootstrap.min.css';
const container = document.getElementById('root')
const root = createRoot(container);
root.render(<Index />)

