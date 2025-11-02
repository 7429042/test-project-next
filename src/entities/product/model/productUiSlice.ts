import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/processes/app/store';

export type IdMap = Record<number, true>

export interface ProductUiState {
    favoriteIds: IdMap;
    deletedIds: IdMap;
}

const initialState: ProductUiState = {
    favoriteIds: {},
    deletedIds: {}
};

const productUiSlice = createSlice({
    name: 'productUi',
    initialState,
    reducers: {
        toggleFavorite: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            if (state.favoriteIds[id]) {
                delete state.favoriteIds[id];
            } else {
                state.favoriteIds[id] = true;
            }

        },
        deleteProduct: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            state.deletedIds[id] = true;
            if (state.favoriteIds[id]) {
                delete state.favoriteIds[id];
            }
        },
        restoreProduct: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            if (state.deletedIds[id]) {
                delete state.deletedIds[id];
            }
        },
        hydrate: (state, action: PayloadAction<Partial<ProductUiState> | undefined>) => {
            if (!action.payload) return;
            if (action.payload.favoriteIds) {
                state.favoriteIds = action.payload.favoriteIds;
            }
            if (action.payload.deletedIds) {
                state.deletedIds = action.payload.deletedIds;
            }
        },
        resetAll() {
            return initialState;
        }
    }
});

export const {
    toggleFavorite,
    deleteProduct,
    restoreProduct,
    hydrate,
    resetAll
} = productUiSlice.actions;

export default productUiSlice.reducer;

export const selectFavoriteIds = (state: RootState) => state.productUi.favoriteIds;
export const selectDeletedIds = (state: RootState) => state.productUi.deletedIds;
export const selectIsFavorite = (id: number) => (state: RootState) => Boolean(state.productUi.favoriteIds[id]);
export const selectIsDeleted = (id: number) => (state: RootState) => Boolean(state.productUi.deletedIds[id]);
