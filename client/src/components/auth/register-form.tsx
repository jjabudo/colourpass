import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
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

export function RegisterForm() {
  const { registerMutation } = useAuth();
  const [colorPattern, setColorPattern] = useState<Array<{ color: string; position: number }>>([]);

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      colorPattern: []
    }
  });

  const onSubmit = (data: InsertUser) => {
    console.log("Form submission started");

    if (colorPattern.length < 4) {
      console.log("Color pattern too short", colorPattern.length);
      form.setError("colorPattern", { 
        message: "Please select at least 4 colors in sequence" 
      });
      return;
    }

    const pattern = colorPattern.map(p => `${p.color}-${p.position}`).join("|");
    console.log("Submitting registration with data:", {
      username: data.username,
      patternLength: colorPattern.length,
      pattern
    });

    registerMutation.mutate({
      ...data,
      colorPattern,
      password: pattern,
      confirmPassword: pattern
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
          <FormLabel>Select Color Pattern</FormLabel>
          <p className="text-sm text-muted-foreground mb-4">
            Select at least 4 colors in sequence. Selected colors: {colorPattern.length}
          </p>
          <ColorGrid 
            onSelect={(selection) => {
              console.log("Color selected:", selection);
              setColorPattern(prev => [...prev, {
                color: selection.color,
                position: selection.position
              }]);
            }}
          />
          <div className="flex gap-2 flex-wrap mt-2">
            {colorPattern.map((item, idx) => (
              <div
                key={idx}
                className="w-6 h-6 rounded flex items-center justify-center"
                style={{ backgroundColor: item.color }}
              >
                <span className="text-xs font-bold" style={{ color: ['yellow', 'orange'].includes(item.color) ? 'black' : 'white' }}>
                  {idx + 1}
                </span>
              </div>
            ))}
            {colorPattern.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setColorPattern([])}
                className="h-6"
              >
                Clear
              </Button>
            )}
          </div>
          {form.formState.errors.colorPattern && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.colorPattern.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={registerMutation.isPending || colorPattern.length < 4}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Register'
          )}
        </Button>

        {registerMutation.error && (
          <p className="text-sm font-medium text-destructive text-center">
            {registerMutation.error.message}
          </p>
        )}

        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive text-center">
            {form.formState.errors.root.message}
          </p>
        )}
      </form>
    </Form>
  );
}