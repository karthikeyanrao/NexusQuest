"use client";
import React from "react";
import { OktoProvider, BuildType } from "okto-sdk-react";

export const OktoWalletProvider = ({ children }) => {
  return (
      <OktoProvider apiKey={process.env.NEXT_PUBLIC_OKTO_API_KEY} buildType={BuildType.SANDBOX}>
        {children}
      </OktoProvider>
  );
};
