import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";

console.log('Is this script running?');



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

let rootEl = document.getElementById('root');
let ulEl = document.createElement('ul');
axios.get('http://localhost:8000/api/customers/').then((response) => {
  for (let customer of response.data) {
    let liEl = document.createElement('li');
    liEl.innerText = customer.first_name;
    ulEl.append(liEl);
  }
  // rootEl.innerHTML = '';
  // rootEl.append(ulEl);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




