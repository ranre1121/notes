import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="px-[100px] ">
      <div className="h-screen flex justify-center items-center">
        <div className="border-gray-400 rounded-lg px-5 py-5 border flex flex-col w-[350px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font bold">Log in</h1>
            <span className="flex text-xl items-center gap-1">
              to
              <p className="text-xl font-semibold bg-gradient-to-r  from-yellow-200 to-yellow-300 w-fit px-1">
                Notes
              </p>
            </span>
          </div>
          <div className="flex flex-col gap-5 mt-7">
            <div>
              <p>Username</p>
              <input
                type="text"
                className="h-7 w-full px-2 py-5 rounded-sm border border-gray-500"
              />
            </div>
            <div>
              <p>Password</p>
              <input
                type="password"
                className="h-7 font-bold w-full px-2 py-5 rounded-sm border border-gray-500"
              />
            </div>
          </div>
          <p className="mt-2 text-blue-500 cursor-pointer">Forgot password?</p>
          <button className="py-3 text-white bg-blue-400 rounded-md mt-5 cursor-pointer">
            Log In
          </button>
          <p className="mt-5 self-center">
            Don't have an account?{" "}
            <Link to={"/register"}>
              <span className="text-blue-400 font-semibold cursor-pointer">
                Sign up now!
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
