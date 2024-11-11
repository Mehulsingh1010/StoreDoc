"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.action";
import OtpModal from "@/components/OTPModal";
import { toast } from "../hooks/use-toast";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email("Please enter a valid email address"),
    fullName:
      formType === "sign-up"
        ? z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters")
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (type === "sign-up") {
        console.log("Creating new account for:", values.email);
        const result = await createAccount({
          fullName: values.fullName || "",
          email: values.email,
        });
        
        if (result.accountId) {
          setAccountId(result.accountId);
          toast({
            title: "Account Created",
            description: "Please check your email for the verification code",
          });
        } else {
          throw new Error("Failed to create account");
        }
      } else {
        console.log("Signing in user:", values.email);
        const result = await signInUser({ email: values.email });
        
        if (result.error) {
          setErrorMessage(result.error);
          toast({
            title: "Sign In Failed",
            description: result.error,
            variant: "destructive",
          });
          return;
        }
        
        if (result.accountId) {
          setAccountId(result.accountId);
          toast({
            title: "Check Your Email",
            description: "We've sent you a verification code",
          });
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      const errorMsg = type === "sign-up"
        ? "Failed to create account. Please try again."
        : "Failed to sign in. Please try again.";
      
      setErrorMessage(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseOtpModal = () => {
    setAccountId(null);
    form.reset();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="shad-input"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="shad-input"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                {type === "sign-in" ? "Signing In..." : "Signing Up..."}
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              </>
            ) : (
              type === "sign-in" ? "Sign In" : "Sign Up"
            )}
          </Button>

          {errorMessage && (
            <p className="error-message text-red-500 text-sm mt-2">
              *{errorMessage}
            </p>
          )}

          <div className="body-2 flex justify-center mt-4">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand hover:underline"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>

      {accountId && (
        <OtpModal 
          email={form.getValues("email")} 
          accountId={accountId}
          onClose={handleCloseOtpModal}
        />
      )}
    </>
  );
};

export default AuthForm;