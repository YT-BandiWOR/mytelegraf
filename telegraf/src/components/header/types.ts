import {DbUser} from "../../types.ts";
import React from "react";

export interface HeaderLink {
    url: string;
    text: string;
    id: number;
}

export interface HeaderLogoInterface {
    logoName?: string
}

export interface HeaderLinksInterface {
    links: HeaderLink[],
    accountInfo: DbUser | null,
    opened: boolean,
    setOpened: CallableFunction
}

export interface HeaderOpenLinks {
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export type ReactSetStateType<T> = React.Dispatch<React.SetStateAction<T>>

export type ReactStatePairType<T> = [T, ReactSetStateType<T>]