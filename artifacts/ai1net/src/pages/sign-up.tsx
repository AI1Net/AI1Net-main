import { SignUp } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignUpPage() {
  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col items-center justify-center p-4 font-sans bg-[linear-gradient(to_right,#333333_1px,transparent_1px),linear-gradient(to_bottom,#333333_1px,transparent_1px)] bg-[size:32px_32px]">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black text-primary tracking-widest filter drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">AI1NET</h1>
        <p className="font-mono text-sm mt-2 text-gray-400">INITIALIZE_NODE // CREATE_IDENTITY</p>
      </div>
      <div className="border-[3px] border-primary shadow-[8px_8px_0px_0px_rgba(255,215,0,1)] p-1 bg-black">
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    </div>
  );
}
