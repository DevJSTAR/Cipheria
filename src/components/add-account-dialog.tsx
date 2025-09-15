"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  issuer: z.string().min(1, "Issuer is required"),
  username: z.string().min(1, "Username is required"),
  secret: z.string().min(1, "Secret is required"),
  favicon: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: z.infer<typeof formSchema>) => void;
}

function AddAccountDialog({
  open,
  onOpenChange,
  onAdd,
}: AddAccountDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issuer: "",
      username: "",
      secret: "",
      favicon: "",
    },
  });
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) {
      form.reset({
        issuer: "",
        username: "",
        secret: "",
        favicon: "",
      });
    }
  }, [open, form]);

  const handleAdd = async (data: z.infer<typeof formSchema>) => {
    onAdd(data);
    toast.success("The TOTP account has been successfully added.");
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit(handleAdd)();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
          <DialogDescription>
            Add a new TOTP account by entering the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form 
            ref={formRef}
            onKeyDown={handleKeyDown}
            onSubmit={form.handleSubmit(handleAdd)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter issuer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter secret" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="favicon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter favicon URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { AddAccountDialog };