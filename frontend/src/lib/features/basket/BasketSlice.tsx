import { createAppSlice } from "@/lib/CreateAppSlice";

interface BasketState {
    basket: any;
}

const initialState: BasketState = {
    // Не читаем localStorage здесь — этот код выполняется на сервере (SSR).
    // Загрузка корзины из localStorage происходит в store.ts через middleware.
    basket: [],
};

export const basketSlice = createAppSlice({
    name: "basket",
    initialState,
    reducers: {
        SetBasket: (state, action) => {
            state.basket = action.payload;
            try {
                if (typeof window !== "undefined") {
                    localStorage.setItem("basket", JSON.stringify(state.basket));
                }
            } catch (error) {
                console.error(error);
            }
        },
    },
});

export const { SetBasket } = basketSlice.actions;
export default basketSlice.reducer;