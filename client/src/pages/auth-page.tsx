import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterForm } from "@/components/auth/register-form";
import { LoginForm } from "@/components/auth/login-form";
import { Shield } from "lucide-react";

export default function AuthPage() {
  const { user } = useAuth();

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto text-primary" />
            <h1 className="mt-4 text-3xl font-bold">Secure Login</h1>
            <p className="mt-2 text-muted-foreground">
              Using graphical passwords to prevent shoulder surfing
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="hidden md:flex bg-muted items-center justify-center p-8">
        <div className="max-w-md space-y-4 text-center">
          <h2 className="text-2xl font-bold">Enhanced Security</h2>
          <p className="text-muted-foreground">
            Our innovative graphical password system helps protect your account from
            shoulder surfing attacks by using a dynamic color grid that changes
            after each selection.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-lg bg-background">
              <h3 className="font-semibold">Dynamic Grid</h3>
              <p className="text-sm text-muted-foreground">
                Grid reshuffles after each selection
              </p>
            </div>
            <div className="p-4 rounded-lg bg-background">
              <h3 className="font-semibold">Color Patterns</h3>
              <p className="text-sm text-muted-foreground">
                Unique color combinations for enhanced security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
