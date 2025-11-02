import {configureStore} from '@reduxjs/toolkit';
import {baseApi} from '@/shared/api/baseApi';
import productUiReducer from '@/entities/product/model/productUiSlice';

const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        productUi: productUiReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;