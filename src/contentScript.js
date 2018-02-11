import React from 'react';
import {render} from 'react-dom';
import Index from './contentScript/index.js';



window.addEventListener('load', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  render(<Index />, el);
  console.log("contentScript Loaded!!!");
})
