"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
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
  favicon: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

interface EditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: {
    id: string;
    issuer: string;
    username: string;
    favicon?: string;
  };
  onSave: (data: z.infer<typeof formSchema>) => void;
}

function EditAccountDialog({
  open,
  onOpenChange,
  account,
  onSave,
}: EditAccountDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issuer: account.issuer,
      username: account.username,
      favicon: account.favicon || "",
    },
  });
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) {
      form.reset({
        issuer: account.issuer,
        username: account.username,
        favicon: account.favicon || "",
      });
    }
  }, [open, account, form]);

  const handleSave = (data: z.infer<typeof formSchema>) => {
    onSave(data);
    toast.success("The TOTP account has been successfully updated.");
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit(handleSave)();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit TOTP Account</DialogTitle>
          <DialogDescription>
            Update the account details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form 
            ref={formRef}
            onKeyDown={handleKeyDown}
            onSubmit={form.handleSubmit(handleSave)}
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
              <Button type="submit">
                <Icons.unlock className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { EditAccountDialog };