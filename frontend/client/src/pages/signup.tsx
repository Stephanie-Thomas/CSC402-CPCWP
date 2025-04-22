import React, { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, GraduationCap } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  gradYear: string;
}

export default function AlumniSignup(): React.ReactElement {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    gradYear: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log("Alumni signup data:", formData);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Alumni Signup</h1>
              </div>
            </div>

            {isSubmitted ? (
              <div className="text-center space-y-4 py-8">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Thank you!</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Your alumni information has been submitted successfully.
                </p>
                
                <div className="mt-6">
                  <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
                    <Button variant="sumbit" className="mx-auto">
                      Return to Homepage
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="text-gray-900 dark:text-gray-300 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-gray-20 dark:bg-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="yourname@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-gray-20 dark:bg-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gradYear">Graduation Year</Label>
                  <Input
                    id="gradYear"
                    name="gradYear"
                    placeholder="e.g. 2020"
                    value={formData.gradYear}
                    onChange={handleChange}
                    required
                    className="bg-gray-20 dark:bg-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leetcodeName">LeetCode Username</Label>
                  <Input
                    id="leetcodeName"
                    name="leetcodeName"
                    placeholder=""
                    value={formData.leetcodeName}
                    onChange={handleChange}
                    required
                    className="bg-gray-20 dark:bg-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codeforcesName">CodeForces Username</Label>
                  <Input
                    id="codeforcesName"
                    name="codeforcesName"
                    placeholder=""
                    value={formData.codeforcesName}
                    onChange={handleChange}
                    required
                    className="bg-gray-20 dark:bg-gray-700"
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
                
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}