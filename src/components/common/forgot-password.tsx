"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface ForgotPasswordProps {
  backToLoginUrl?: string;
  layoutWrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

export default function ForgotPassword({ backToLoginUrl = "/login", layoutWrapper: Layout }: ForgotPasswordProps) {
  const [language, setLanguage] = useState<"EN" | "CN">("EN");
  const [email, setEmail] = useState("");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "CN" : "EN"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log("Forgot password request:", { email });
  };

  const text = {
    EN: {
      title: "Reset Password",
      subtitle: "Enter your email address to reset your password",
      emailLabel: "Email Address",
      resetButton: "SEND RESET LINK",
      backToLogin: "Back to Login",
    },
    CN: {
      title: "重置密码",
      subtitle: "输入您的邮箱地址以重置密码",
      emailLabel: "邮箱地址",
      resetButton: "发送重置链接",
      backToLogin: "返回登录",
    },
  };

  const content = (
    <div className="flex items-center justify-center flex-1 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-light tracking-wider text-foreground italic">{text[language].title}</h1>
        </div>
        {/* Reset Form */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <p className="text-foreground font-light italic text-lg">{text[language].subtitle}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  {text[language].emailLabel}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border focus:ring-ring"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium tracking-wide"
              >
                {text[language].resetButton}
              </Button>
            </form>
            <div className="text-center">
              <Link
                href={backToLoginUrl}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {text[language].backToLogin}
              </Link>
            </div>
          </CardContent>
        </Card>
        {/* Language Toggle Button */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-muted-foreground hover:text-foreground"
          >
            {language === "EN" ? "切换到中文" : "Switch to English"}
          </Button>
        </div>
      </div>
    </div>
  );

  return Layout ? <Layout>{content}</Layout> : content;
}
