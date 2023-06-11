import React, { useState, useEffect } from 'react';
import cls from './Header.module.scss';
import HeaderLogo from "./HeaderLogo.tsx";
import HeaderLinks from "./HeaderLinks.tsx";
import HeaderOpenLinks from "./HeaderOpenLinks.tsx";
import {HeaderLink} from "./types.ts";
import telegrafAPI from "../../api/telegrafAPI.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {setUser} from "../../redux/userSlice.ts";


const Header: React.FC = () => {
    const links: HeaderLink[] = [
        { text: 'Чаты', url: '/chats', id: 1 },
        { text: 'Инфо', url: '/info', id: 2 },
    ];
    const logoName = 'Telegraf';
    const [opened, setOpened] = useState<boolean>(window.screen.width > 600);
    const user = useSelector((state: RootState) => state.user.user); // Путь к вашему корневому редюсеру и полю пользователя
    const dispatch = useDispatch();

    useEffect(()=> {
        const getUser = async () => {
            try {
                const fetchedUser = await telegrafAPI().me(); // Замените на фактический вызов вашего метода получения пользователя
                dispatch(setUser(fetchedUser.data.user));

            } catch (error) {
                console.error('Ошибка при получении пользователя:', error);
            }
        }

        if (!user) {
            getUser();
        }
    }, [dispatch, user]);

    return (
        <header className={cls.header}>
            <HeaderLogo logoName={logoName} />
            <HeaderLinks opened={opened} setOpened={setOpened} links={links} accountInfo={user} />
            <HeaderOpenLinks setOpened={setOpened}/>
        </header>
    );
};

export default Header;