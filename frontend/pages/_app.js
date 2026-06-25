import "../styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { clearProfile } from "../lib/storage";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    function handleAccountsChanged(accounts) {
      // Cuando MetaMask cambia de cuenta, cerramos sesión y vamos a la landing
      clearProfile();
      router.push("/");
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
  }, []);

  return (
    <>
      <Head>
        <title>Vaquitapp 🐄</title>
        <meta name="description" content="La forma más transparente y divertida de organizar gastos grupales." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐄</text></svg>" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
