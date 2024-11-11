"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { verifySecret, sendEmailOTP } from "@/lib/actions/user.action";
import { toast } from "../hooks/use-toast";

interface OtpModalProps {
  accountId: string;
  email: string;
  onClose?: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ accountId, email, onClose }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (password.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Verifying OTP for:", { accountId, password });
      const result = await verifySecret({ accountId, password });

      if (result?.sessionId) {
        console.log("OTP verified successfully");
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
        router.push("/");
        router.refresh();
      } else {
        // Show toast for invalid OTP instead of throwing an error
        toast({
          title: "Verification Failed",
          description: "Wrong OTP, please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = useCallback(async () => {
    if (resendDisabled) return;

    try {
      setResendDisabled(true);
      await sendEmailOTP({ email });
      toast({
        title: "OTP Resent",
        description: "Please check your email for the new OTP",
      });

      // Disable resend button for 60 seconds
      setTimeout(() => setResendDisabled(false), 60000);
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
      setResendDisabled(false);
    }
  }, [email, resendDisabled]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="shad-alert-dialog max-w-[400px]">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter Your OTP
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={handleClose}
            >
              <Image
                src="/assets/icons/close-dark.svg"
                alt="close"
                width={20}
                height={20}
                className="otp-close-button"
              />
            </Button>
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We&apos;ve sent a code to{" "}
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4">
          <InputOTP
            maxLength={6}
            value={password}
            onChange={setPassword}
            className="gap-2"
          >
            <InputOTPGroup className="shad-otp gap-2">
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="shad-otp-slot h-12 w-12"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              className="shad-submit-btn h-12"
              disabled={isLoading || password.length !== 6}
            >
              {isLoading ? (
                <>
                  Verifying...
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="ml-2 animate-spin"
                  />
                </>
              ) : (
                "Verify OTP"
              )}
            </AlertDialogAction>

            <div className="subtitle-2 mt-2 text-center text-light-100">
              Didn&apos;t get a code?{" "}
              <Button
                type="button"
                variant="link"
                className="pl-1 text-brand"
                onClick={handleResendOtp}
                disabled={resendDisabled}
              >
                {resendDisabled ? "Wait 60s" : "Click to resend"}
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;
