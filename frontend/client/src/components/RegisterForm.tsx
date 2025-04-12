// src/components/RegisterForm.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    leetcodeUsername: "",
    codeforcesUsername: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("https://csc402-cpcwp.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess();
      } else {
        setError(data.message || "Failed to register");
      }
    } catch (err) {
      setError("Network error. Try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        name="email"
        type="email"
        placeholder="your.name@wcupa.edu"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        name="leetcodeUsername"
        placeholder="LeetCode Username"
        value={formData.leetcodeUsername}
        onChange={handleChange}
        required
      />
      <Input
        name="codeforcesUsername"
        placeholder="Codeforces Username"
        value={formData.codeforcesUsername}
        onChange={handleChange}
        required
      />
      {error && <p className="text-sm text-red-500"> {error}</p>}
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
