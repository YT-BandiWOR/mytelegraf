import React from 'react';
import cls from "./Modal.module.scss";
import {FullScreenBlockerInterface} from "./types.ts";

const FullscreenModal: React.FC<FullScreenBlockerInterface> = ({ children, isOpened, setOpened }) => {
    return (
        isOpened ? (
            <div className={cls.blur}>
                {
                    setOpened && (
                        <div className={cls.close_icon} onClick={() => setOpened(false)}></div>
                    )
                }
                <div className={cls.content}>
                    {children}
                </div>
            </div>
        ) : null
    );
};

export default FullscreenModal;
