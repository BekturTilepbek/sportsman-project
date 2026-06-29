import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { basketSlice, SetBasket } from "./features/basket/BasketSlice";
import { productSlice } from "./features/product/ProductSlice";

const rootReducer = combineSlices(
  basketSlice,
  productSlice,
);
export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
  });

  // Загружаем корзину из localStorage только в браузере (не на сервере)
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("basket");
      if (saved) {
        store.dispatch(SetBasket(JSON.parse(saved)));
      }
    } catch (error) {
      console.error("Не удалось загрузить корзину:", error);
    }
  }

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;