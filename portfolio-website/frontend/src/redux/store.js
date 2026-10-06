import { configureStore } from '@reduxjs/toolkit';
import { publicApi } from './features/publicApi';

export const store = configureStore({
    reducer: {
        [publicApi.reducerPath]: publicApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(publicApi.middleware),
})