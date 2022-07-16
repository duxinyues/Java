/*
 * @Author: 韦永愿 1638877065@qq.com
 * @Date: 2022-07-11 15:12:37
 * @LastEditors: duxinyues yongyuan253015@gmail.com
 * @LastEditTime: 2022-07-16 21:51:13
 * @FilePath: \webide\client\src\index.js
 * @Description: 
 * Copyright (c) 2022 by 韦永愿 email: 1638877065@qq.com, All Rights Reserved.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import WebIDE from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<WebIDE />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
