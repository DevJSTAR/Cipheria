"use client";

import { useEffect, useRef } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import { LockIcon } from "lucide-react";

const formSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

interface LoginFormProps {
  onLogin: (password: string) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  }, []);

  useEffect(() => {
    return () => {
      form.reset({
        password: "",
      });
    };
  }, [form]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    onLogin(data.password);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Image 
              src="/logo-black.svg" 
              alt="Cipheria Logo" 
              width={120} 
              height={120}
              className="dark:invert"
            />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Monument Extended, sans-serif' }}>
            Cipheria
          </h1>
        </div>
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            Enter your master password to access your accounts
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <LockIcon className="h-4 w-4" />
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your master password"
                      {...field}
                      ref={(e) => {
                        field.ref(e);
                        passwordRef.current = e;
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <LockIcon className="mr-2 h-4 w-4" />
              Unlock
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}

export { LoginForm };