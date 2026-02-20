import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const Buy = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [course, setCourse] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ✅ PROPER AUTH GUARD
  useEffect(() => {
    if (!token) {
      navigate(`/login?redirect=/buy/${courseId}`, { replace: true });
      return;
    }
  }, [token, navigate, courseId]);

  useEffect(() => {
  const fetchBuyCourseData = async () => {

    if (!token) {
      navigate(`/login?redirect=/buy/${courseId}`, { replace: true });
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/course/buy/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourse(response.data.course);
      setClientSecret(response.data.clientSecret);

    } catch (err) {

      if (err?.response?.status === 400) {
        navigate("/purchases", { replace: true });
      } else {
        setError("Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };

  fetchBuyCourseData();

}, [courseId, token, navigate]);


  // 💳 HANDLE PAYMENT
  const handlePayment = async (e) => {
  e.preventDefault();

  if (!stripe || !elements || !clientSecret) return;

  const cardElement = elements.getElement(CardElement);

  const { paymentIntent, error } = await stripe.confirmCardPayment(
    clientSecret,
    {
      payment_method: {
        card: cardElement,
      },
    }
  );

  if (error) {
    setError(error.message);
  } else if (paymentIntent.status === "succeeded") {

    try {
      await axios.post(
        `${BACKEND_URL}/course/confirm/${courseId}`,
        { paymentIntentId: paymentIntent.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Payment Successful!");
      navigate("/purchases");

    } catch (err) {
      console.error("Error saving purchase:", err);
      setError("Payment succeeded but saving purchase failed.");
    }
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (!course) {
  return (
    <div className="flex justify-center items-center h-screen">
      <p>No course data found.</p>
    </div>
  );
}


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 border p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">{course.title}</h2>

        <p className="text-red-500 font-bold mb-4">
          ₹ {course.price}
        </p>

        <form onSubmit={handlePayment}>
          <div className="border p-3 rounded mb-4">
            <CardElement />
          </div>

          <button
            type="submit"
            disabled={!stripe}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Buy;
