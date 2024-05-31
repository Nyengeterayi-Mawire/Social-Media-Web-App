import {configureStore} from '@reduxjs/toolkit';
import navbarReducer from './features/navbarSlice.jsx'; 
import userReducer from './features/userSlice.jsx'; 
import messageReducer from './features/meassages.jsx'
export const store = configureStore ({
    reducer : {
        navbar : navbarReducer ,
        user : userReducer, 
        messages : messageReducer
    }
}) 
