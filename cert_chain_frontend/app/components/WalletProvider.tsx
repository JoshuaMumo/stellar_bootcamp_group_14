"use client";

import React, { createContext, useCallback, useState } from "react";
import {
  connectFreighter,
  retrievePublicKey,
  shortenPublicKey,
} from "../services/stellar-helpers";

type WalletContextType = {
  address: string | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
};

export const WalletContext = createContext<WalletContextType>({
  address: null,
  connected: false,
  connect: async () => {},
  disconnect: () => {},
});

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(async () => {
    try {
      const ok = await connectFreighter();
      if (!ok) return;
      const pk = await retrievePublicKey();
      setAddress(shortenPublicKey(pk));
      setConnected(true);
    } catch (err) {
      console.error("Wallet connect failed", err);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setConnected(false);
  }, []);

  return (
    <WalletContext.Provider value={{ address, connected, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}
