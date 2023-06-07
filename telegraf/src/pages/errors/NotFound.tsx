import React from 'react';
import cls from "./Error.module.scss";


const NotFound: React.FC = () => {
    return (
        <main className={cls.auth_page}>
            <h1>Ошибка <span className={cls.error_color}>404</span></h1>
            <p className={`${cls.description} ${cls.error}`}>Страница по запросу не найдена.</p>
            <p className={`${cls.description} ${cls.info}`}>Проверьте, корректен ли URL-адрес в поле поиска, либо обратитесь к администратору сайта за дополнительной информацией.</p>
        </main>
    );
};

export default NotFound;