"use client";

const Registration = () => {
  const registrationHandler = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log(name, email, password);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-5 text-center">
        Registration Form
      </h3>

      <form
        onSubmit={registrationHandler}
        className="flex flex-col gap-3 text-center"
      >
        <input
          type="text"
          name="name"
          placeholder="Enter your name..."
          required
        />
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
          <button className="rr-custom">Register Now</button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
