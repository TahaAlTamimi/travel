"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { FC, InputHTMLAttributes } from "react";
// Form validation schema
const schema = z.object({
    name: z.string().min(2, "Name is required"),
    phone: z.string().min(8, "Phone number is required"),
    email: z.string().email("Invalid email").optional(),
    destination: z.string().optional(),
    date: z.string().optional(),
});

type BookingForm = z.infer<typeof schema>;

export default function BookingPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<BookingForm>({
        resolver: zodResolver(schema),
    });

    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);


    const onSubmit = async (data: BookingForm) => {
        try {
            const url = "https://script.google.com/macros/s/AKfycbzGTBFbK1_qqZiGXLNPYzcOICG4mxEOCeRozRlHdr_d5R09ltFKHxVUEcE1NrevM-hgkQ/exec";

            await axios.get(url, {
                params: {
                    action: "write",
                    path: "Sheet1",
                    ...data,
                },
            });

            setMessage({ type: "success", text: "✅ Booking submitted successfully!" });
            reset();
        } catch (err) {
            console.error("Submission error:", err);
            setMessage({ type: "error", text: "❌ Something went wrong. Please try again." });
        }

        // Optional: hide message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Image
                        src="/logo.png"
                        alt="Company Logo"
                        width={80}
                        height={80}
                        className="rounded-full shadow"
                    />
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">✈️ Book Your Trip</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Full Name" {...register("name")} error={errors.name?.message} />
                    <Input label="Phone Number" {...register("phone")} error={errors.phone?.message} />
                    <Input label="Email" {...register("email")} type="email" />
                    <Input label="Destination" {...register("destination")} />
                    <Input label="Travel Date" {...register("date")} type="date" />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Booking"}
                    </button>

                    {/* Message */}
                    {message && (
                        <p
                            className={`text-sm mt-3 text-center font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {message.text}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
function getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
}
// Input field

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    type?: string;

}
const Input: FC<InputProps> = ({ label, error, type, ...rest }) => (
    <div>
        <label className="block mb-1 font-medium text-gray-700">{label}</label>
        <input
            type={type}
            min={type === "date" ? getTomorrowDate() : undefined}
            className={`w-full px-4 py-2 rounded-lg border ${error ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            {...rest}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
);

