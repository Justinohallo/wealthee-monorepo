"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Check, Eye, EyeOff, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addClient } from "@/services/client/users";
import { useRouter } from "next/navigation";

interface ClientFormProps {
  portfolioManagerId: string;
  idToken: string;
}

export default function ClientForm({ portfolioManagerId, idToken }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setIsSuccess(false);

      // Call the addClient service function
      const result = await addClient(formData, idToken, portfolioManagerId);

      // Handle different result statuses
      switch (result.status) {
        case "created":
          setIsSuccess(true);
          // Refresh server data and redirect after a brief delay
          setTimeout(() => {
            router.refresh();
            router.push("/manager/clients");
          }, 1500);
          break;

        case "existing":
          // Show existing client error in UI
          setErrors({
            form: "A client with this email already exists"
          });
          setIsSubmitting(false);
          break;

        case "conflict":
          // Show conflict error in UI
          setErrors({
            form: result.message || "Client is already associated with another portfolio manager"
          });
          setIsSubmitting(false);
          break;

        default:
          // Unexpected status
          setErrors({
            form: "An unexpected error occurred"
          });
          setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error adding client:", error);
      // Show error in UI
      setErrors({
        form: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isSubmitting || isSuccess}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isSubmitting || isSuccess}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="client@example.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting || isSuccess}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter client password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting || isSuccess}
            className="pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Set a secure password for the client.
        </p>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {errors.form && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800">
          {errors.form}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : isSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added
            </>
          ) : (
            "Add Client"
          )}
        </Button>
      </div>
    </form>
  );
}
