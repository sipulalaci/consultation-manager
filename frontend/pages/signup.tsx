import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Login } from "../components/Login/Login";
import { SignUp } from "../components/Signup/Signup";

const SignupPage: NextPage = () => {
  return <SignUp />;
};

export default SignupPage;
