import cls from './Header.module.scss';
import React from "react";
import {HeaderOpenLinks} from "./types.ts";


const HeaderOpenLinks: React.FC<HeaderOpenLinks> = ({ setOpened }) => {
    return (
        <div
            className={cls.open_links}
            onClick={() => setOpened((prevState: boolean) => !prevState)}
        />
    );
}

export default HeaderOpenLinks;