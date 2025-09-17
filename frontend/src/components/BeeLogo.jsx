import React from "react";
import logo from "../assets/logo.png";

export default function BeeLogo({ size = 40 }) {
  return (
    <img
      src={logo}
      alt="BudgetBee Logo"
      width={size}
      height={size}
      className="rounded-full"
    />
  );
}
