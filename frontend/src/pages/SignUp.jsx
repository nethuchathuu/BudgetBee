import React from "react";
import Navbar from "../components/NavSign";
import Footer from "../components/Footer";
import SignUpLeft from "../components/com_signup/SignUpLeft";
import SignUpRight from "../components/com_signup/SignUpRight";

export default function SignUp() {
  return (

    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0c111c] to-[#0b1422]">
          <Navbar />
          <main className="flex flex-grow items-center justify-center px-4 py-12">
            <div className="flex bg-[#101828] rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">
              <SignUpLeft />
              <SignUpRight />
            </div>
          </main>
          <Footer />
        </div>

  );
}
