import {Link} from "react-router-dom";
import cls from './Header.module.scss';
import React from "react";
import {HeaderLinksInterface} from "./types.ts";


const HeaderLinks: React.FC<HeaderLinksInterface> = ({ links, accountInfo, opened, setOpened }) => {
    const account = accountInfo ? (
        <Link to="/account">{accountInfo.username}</Link>
    ) : (
        <Link to="/login">Войти</Link>
    );

    if (opened) {
        return (
            <div className={cls.links}>
                {
                    links.map((element) => (
                        <Link to={element.url} key={element.id}>
                            {element.text}
                        </Link>
                    ))
                }
                {account}
                <button onClick={()=>setOpened(false)}>Закрыть</button>
            </div>
        );
    } else {
        return null;
    }
}

export default HeaderLinks;