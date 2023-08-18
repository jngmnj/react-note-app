import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { AppDispatch, RootState } from "../store";

export const useAppDispatch = () => useDispatch<AppDispatch>(); // AppDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // parameter에 rootstate안넣어주기위해
