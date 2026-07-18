"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        loginMethods: ["email", "sms"],
        appearance: {
          theme: "dark",
          accentColor: "#FFD24D",
        },
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
