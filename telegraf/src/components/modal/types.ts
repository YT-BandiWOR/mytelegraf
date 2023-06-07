import * as React from "react";

export interface FullScreenBlockerInterface {
    children?: React.ReactNode
    isOpened: boolean,
    setOpened?: React.Dispatch<React.SetStateAction<boolean>>
}