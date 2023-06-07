import React, { useState } from 'react';
import cls from './Header.module.scss';
import HeaderLogo from "./HeaderLogo.tsx";
import HeaderLinks from "./HeaderLinks.tsx";
import HeaderOpenLinks from "./HeaderOpenLinks.tsx";
import {HeaderInterface, HeaderLink} from "./types.ts";


const Header: React.FC<HeaderInterface> = ({ account }) => {
    const links: HeaderLink[] = [
        { text: 'Чаты', url: '/chats', id: 1 },
        { text: 'Инфо', url: '/info', id: 2 },
    ];
    const logoName = 'Telegraf';
    const [opened, setOpened] = useState<boolean>(window.screen.width > 600);

    return (
        <header className={cls.header}>
            <HeaderLogo logoName={logoName} />
            <HeaderLinks opened={opened} setOpened={setOpened} links={links} accountInfo={account} />
            <HeaderOpenLinks setOpened={setOpened}/>
        </header>
    );
};

export default Header;