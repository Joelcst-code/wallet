import { Header } from "@/components/Header";
import { Balance } from "@/components/Balance";
import { Actions } from "@/components/Actions";
import { CryptoCard } from "@/components/CryptoCard";
import { Movements } from "@/components/Movements";
import { CryptoToggle } from "@/components/CryptoToggle";
import { SendSheet } from "@/components/SendSheet";
import { Toast } from "@/components/Toast";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Balance />
      <Actions />
      <CryptoCard />
      <Movements />
      <CryptoToggle />
      <SendSheet />
      <Toast />
    </main>
  );
}
