"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You're subscribed! Watch your inbox for the next issue.");
    setEmail("");
  };

  return (
    <form onSubmit={submit} className="join w-full" noValidate>
      <label className="input join-item w-full">
        <Mail className="size-4 opacity-60" />
        <input
          type="email"
          placeholder="you@example.com"
          aria-label="Email for newsletter"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="grow"
        />
      </label>
      <button className="btn btn-primary join-item">Subscribe</button>
    </form>
  );
}
