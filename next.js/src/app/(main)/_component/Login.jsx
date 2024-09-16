"use client";
import { signIn } from "next-auth/react";

const Login = () => {
  const loginHandler = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log(res);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-5 text-center">Login Form</h3>

      <form onSubmit={loginHandler} className="flex flex-col gap-3 text-center">
        <input
          type="email"
          name="email"
          placeholder="Enter your email..."
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password..."
          required
        />
        <div>
          <button className="rr-custom">Login Now</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
