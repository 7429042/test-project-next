import {IProduct, ProductId} from '@/entities/product/model/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/processes/app/store';

export interface ProductLocalState {
    byId: Record<string, IProduct>;
}

const initialState: ProductLocalState = {
    byId: {}
};

const productLocalSlice = createSlice({
    name: 'productLocal',
    initialState,
    reducers: {
        upsertProduct(state, action: PayloadAction<IProduct>) {
            const p = action.payload;
            state.byId[String(p.id)] = p;
        },
        removeProduct(state, action: PayloadAction<ProductId>) {
            delete state.byId[String(action.payload)];
        },
        resetAll() {
            return initialState;
        },
    },
});

export const {upsertProduct, removeProduct, resetAll} = productLocalSlice.actions;
export default productLocalSlice.reducer;

export const selectLocalById = (id: ProductId | string) => (state: RootState) =>
    state.productLocal.byId[String(id)] as IProduct | undefined;

export const selectAllLocal = (state: RootState) =>
    Object.values(state.productLocal.byId) as IProduct[];