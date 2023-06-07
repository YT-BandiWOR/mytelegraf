import {Link} from "react-router-dom";
import cls from "./Header.module.scss";
import React from "react";
import {HeaderLogoInterface} from "./types.ts";

const HeaderLogo: React.FC<HeaderLogoInterface> = ({ logoName }) => {
    return (
        <Link to="/" className={cls.logo}>
            <div className={cls.logo_icon} />
            <div className={cls.logo_name}>{logoName && logoName}</div>
        </Link>
    );
}

export default HeaderLogo;