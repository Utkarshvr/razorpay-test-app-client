import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@material-tailwind/react";

export default function App() {
  return (
    <section className="h-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] text-white">
      <header className="p-4 ">
        <SignedOut>
          <Button className="w-full bg-[#1B9CFC]">
            <SignInButton />
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      {/* Main  */}
      <main className="flex justify-center items-center "></main>
    </section>
  );
}
