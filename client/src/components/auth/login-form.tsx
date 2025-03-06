import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ColorGrid } from "./color-grid";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const { loginMutation } = useAuth();
  const [pattern, setPattern] = useState<Array<{
    color: string;
    character: string;
    position: number;
  }>>([]);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      pattern: []
    }
  });

  const onSubmit = (data: LoginData) => {
    if (pattern.length < 4) {
      form.setError("pattern", { 
        message: "Please complete your color pattern" 
      });
      return;
    }

    loginMutation.mutate({
      username: data.username,
      password: pattern.map(p => `${p.color}-${p.position}`).join("|")
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Enter Your Pattern</FormLabel>
          <ColorGrid 
            onSelect={(selection) => {
              setPattern(prev => [...prev, selection]);
            }}
          />
          <div className="flex gap-2 flex-wrap mt-2">
            {pattern.map((item, idx) => (
              <div
                key={idx}
                className="w-6 h-6 rounded"
                style={{ backgroundColor: item.color }}
              />
            ))}
          </div>
          {form.formState.errors.pattern && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.pattern.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>

        {loginMutation.error && (
          <p className="text-sm font-medium text-destructive text-center">
            {loginMutation.error.message}
          </p>
        )}
      </form>
    </Form>
  );
}