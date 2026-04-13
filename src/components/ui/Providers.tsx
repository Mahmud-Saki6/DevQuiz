"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";

import { persistor, store } from "@/store";

export function Providers({ children }: PropsWithChildren) {
  // PersistGate uses window; keep SSR safe
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <SessionProvider>
      <Provider store={store}>
        {mounted ? (
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        ) : (
          children
        )}
      </Provider>
    </SessionProvider>
  );
}

