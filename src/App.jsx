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

  const onSubscribe = async (plan) => {
    try {
      const { data } = await axiosInstance.post("/razorpay/subscriptions", {
        plan_id: "plan_ONnZ8V0e9HDcea",
        userId: user.user.id,
      });
      console.log(data);
      // return;
      // if (data.short_url) window.location.href = data.short_url;
      if (data.short_url) {
        handlePaymentVerify(data, plan);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handlePaymentVerify Function
  const handlePaymentVerify = async (data, plan) => {
    console.log("data.id: ", data.id);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      subscription_id: data.id,
      name: plan.item.name,
      description: plan.item.description,
      amount: plan.item.amount,
      currency: "INR",

      handler: async (response) => {
        console.log("response", response);
        try {
          const { data: verifyData } = await axiosInstance.post(
            "payment/verify-subscription",
            {
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );
          console.log({ verifyData });
        } catch (error) {
          console.log(error);
        }
      },

      theme: {
        color: "#5f63b8",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
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
            <Button onClick={() => onSubscribe(plan)}>Subscribe</Button>
          </div>
        ))}
      </main>
    </section>
  );
}
