import React from 'react';
import cls from "./App.module.scss";
import {Routes, Route} from "react-router-dom";
import Header from "./components/header/Header.tsx";
import Footer from "./components/footer/Footer.tsx";
import NotFound from "./pages/errors/NotFound.tsx";
import LoginPage from "./pages/authorization/LoginPage.tsx";
import RegisterPage from "./pages/authorization/RegisterPage.tsx";
import AccountPage from "./pages/account/AccountPage.tsx";


const App: React.FC = () => {
    return (
        <div className={cls.app}>
            <div>
                <Header/>
                <Routes>
                    <Route path={'/account'} element={<AccountPage/>}/>
                    <Route path={'/login'} element={<LoginPage/>}/>
                    <Route path={'/register'} element={<RegisterPage/>}/>
                    <Route path={'*'} element={<NotFound/>}/>
                </Routes>
            </div>

            <Footer/>
        </div>
    );
};

export default App;