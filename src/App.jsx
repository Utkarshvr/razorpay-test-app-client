import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axiosInstance from "./utils/axiosInstance";

export default function App() {
  const user = useUser();

  const [plans, setPlans] = useState([]);

  const fetchPlans = async () => {
    try {
      const { data } = await axiosInstance.get("/razorpay/plans");
      setPlans(data.items.filter((pl) => pl.id === "plan_ONnZ8V0e9HDcea"));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPlans();
  }, []);

  const onSubscribe = async () => {
    try {
      const { data } = await axiosInstance.post("/razorpay/subscriptions", {
        plan_id: "plan_ONnZ8V0e9HDcea",
        userId: user.user.id,
      });
      console.log({ data });
      // return;
      if (data.short_url) window.location.href = data.short_url;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="h-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] text-white">
      <header className="p-4 ">
        <SignedOut>
          <SignInButton className="w-full bg-[#1B9CFC]" />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      {/* Main  */}
      <main className="p-4 gap-4 flex justify-center  flex-col">
        <h3 className="font-bold text-3xl">Plans</h3>

        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-gray-800 rounded-md flex p-2 justify-center gap-2 flex-col"
          >
            <p>{plan.item.name}</p>
            <p>{plan.item.description}</p>
            <p className="font-bold">
              {plan.item.amount / 100}rs {plan.period}
            </p>
            <Button onClick={onSubscribe}>Subscribe</Button>
          </div>
        ))}
      </main>
    </section>
  );
}
