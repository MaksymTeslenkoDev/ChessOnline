import WebSocketProvider from "@/providers";
import type { AppProps } from "next/app";
import { NextComponentType, NextPageContext } from "next";
import React from "react";
import "../styles/globals.css";

type CustomComponent = NextComponentType<NextPageContext, any, any> & {};

interface CustomAppProps extends AppProps {
  Component: CustomComponent;
}
export default function MyApp({ Component, pageProps }: CustomAppProps) {
  return (
    <WebSocketProvider>
      <Component {...pageProps} />
    </WebSocketProvider>
  );
}
