import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <div className="w-screen h-screen grid-cols-1 lg:grid-cols-2 grid">
        <div className=" bg-[#222831] h-screen flex items-center justify-center">
          <ClerkLoaded>
            <SignIn path="/sign-in" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className=" animate-spin text-white" />
          </ClerkLoading>
        </div>
        <div className="hidden lg:block">
          <div className="h-screen w-full backcons flex items-center justify-center ">
            <Image src="/logo.svg" width={200} height={200} alt="logo"></Image>
          </div>
        </div>
      </div>
    </>
  );
}
