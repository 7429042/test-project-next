import {configureStore} from '@reduxjs/toolkit';
import {baseApi} from '@/shared/api/baseApi';
import productUiReducer from '@/entities/product/model/productUiSlice';
import productLocalReducer from '@/entities/product/model/productLocalSlice';

const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        productUi: productUiReducer,
        productLocal: productLocalReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;