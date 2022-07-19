import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Navbar } from "../components/layout/Navbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <nav className="bg-indigo-600 text-white p-2 border-b-4 border-blue-500 shadow-lg">
        <Navbar />
      </nav> */}
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
