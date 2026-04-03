"use client";

import { Provider } from "react-redux";
// This path should now work!
import { store } from "../../features/store/store";

export default function StoreProvider({ children }) {
    return <Provider store={store}>{children}</Provider>;
}