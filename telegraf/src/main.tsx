import './index.scss'
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import App from "./App.tsx";
import React from "react";
import store from "./redux/store.ts";
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
)
