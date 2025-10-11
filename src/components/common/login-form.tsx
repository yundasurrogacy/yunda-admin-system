import React from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
  loading?: boolean;
  title?: string;
  forgotPasswordLink?: string;
  showLanguageToggle?: boolean;
  language?: 'EN' | 'CN';
  onLanguageChange?: () => void;
}

export function LoginForm({ 
  onSubmit, 
  loading = false, 
  title = 'ADMIN', 
  forgotPasswordLink,
  showLanguageToggle = false,
  language = 'EN',
  onLanguageChange
}: LoginFormProps) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  const texts = {
    EN: {
      emailLabel: "Email Address",
      passwordLabel: "Password",
      forgotPassword: "FORGOT PASSWORD?",
      loginButton: "LOG IN",
      subtitle: "Log in using your email address"
    },
    CN: {
      emailLabel: "邮箱地址",
      passwordLabel: "密码",
      forgotPassword: "忘记密码？",
      loginButton: "登录",
      subtitle: "使用您的邮箱地址登录"
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-sage-800">{title}</h1>
        </div>

        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-lg font-medium text-sage-800 mb-6">{texts[language].subtitle}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-sage-800">
                  {texts[language].emailLabel}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-sage-50 border-sage-200 focus:border-sage-300 focus:ring-sage-300 font-medium text-sage-800"
                />
                {/*
                {forgotPasswordLink && (
                  <div className="text-right">
                    <a
                      href={forgotPasswordLink}
                      className="text-xs text-sage-800 hover:text-sage-900 font-medium"
                    >
                      {texts[language].forgotPassword}
                    </a>
                  </div>
                )}
                */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-sage-800">
                  {texts[language].passwordLabel}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-sage-50 border-sage-200 focus:border-sage-300 focus:ring-sage-300 font-medium text-sage-800"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-sage-100 hover:bg-sage-200 text-sage-800 border border-sage-300 font-medium"
            >
              {loading ? (language === 'EN' ? "LOGGING IN..." : "登录中...") : texts[language].loginButton}
            </Button>
          </form>
        </div>

        {showLanguageToggle && (
          <div className="text-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLanguageChange}
              className="text-sage-800 hover:text-sage-900 font-medium"
            >
              {language === 'EN' ? '切换到中文' : 'Switch to English'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
