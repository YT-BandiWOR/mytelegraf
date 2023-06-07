import React, {useEffect, useState} from 'react';
import cls from "./App.module.scss";
import {Routes, Route} from "react-router-dom";
import Header from "./components/header/Header.tsx";
import Footer from "./components/footer/Footer.tsx";
import NotFound from "./pages/errors/NotFound.tsx";
import {DbUser} from "./types.ts";
import telegrafAPI from "./api/telegrafAPI.ts";
import LoginPage from "./pages/authorization/LoginPage.tsx";
import RegisterPage from "./pages/authorization/RegisterPage.tsx";
import AccountPage from "./pages/account/AccountPage.tsx";


const App: React.FC = () => {
    const [account, setAccount] = useState<DbUser | null>(null);

    useEffect(()=> {
        async function fetchData() {
            try {
                const response = await telegrafAPI().me();
                setAccount(response.data.user);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [])

    return (
        <div className={cls.app}>
            <div>
                <Header account={account}/>
                <Routes>
                    <Route path={'/account'} element={<AccountPage account={account}/>}/>
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