import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DbUser} from "../types.ts";

interface UserState {
    user: DbUser | null
}

const initialState: UserState = {
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<DbUser>) => {
            state.user = action.payload;
        },
        logoutUser: (state) => {
            state.user = null;
        },
        // Здесь можно добавить другие действия (например, удаление пользователя)
    },
});

export const {setUser, logoutUser} = userSlice.actions;
export default userSlice.reducer;