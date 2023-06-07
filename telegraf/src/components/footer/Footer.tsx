import React from 'react';
import {FooterInterface} from "./types.ts";
import cls from "./Footer.module.scss";


const Footer: React.FC<FooterInterface> = () => {
    return (
        <footer className={cls.footer}>
            Все права сайта защищены &copy;
        </footer>
    );
};

export default Footer;