"use client";

import * as React from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditAccountDialog } from "@/components/edit-account-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface TOTPCardProps {
  id: string;
  issuer: string;
  username: string;
  code: string;
  nextCode: string;
  timeLeft: number;
  favicon?: string;
  onEdit: (data: z.infer<typeof formSchema>) => void;
  onDelete: () => void;
}

const formSchema = z.object({
  issuer: z.string().min(1, "Issuer is required"),
  username: z.string().min(1, "Username is required"),
  favicon: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

function TOTPCard({
  id,
  issuer,
  username,
  code,
  nextCode,
  timeLeft,
  favicon,
  onEdit,
  onDelete,
}: TOTPCardProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const { theme, systemTheme } = useTheme();
  
  const progressPercentage = (timeLeft / 30) * 100;
  
  const getProgressColor = () => {
    if (timeLeft <= 10) return "text-orange-500";
    return "text-purple-500";
  };
  
  const isDarkMode = () => {
    if (theme === "system") {
      return systemTheme === "dark";
    }
    return theme === "dark";
  };
  
  const handleCopyCode = (codeToCopy: string, type: string) => {
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(codeToCopy);
    toast.success(`The ${type} code has been copied to your clipboard.`);
    
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const handleEdit = (data: z.infer<typeof formSchema>) => {
    onEdit(data);
  };

  const handleDelete = () => {
    onDelete();
    setDeleteOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2 pb-1 pt-0">
            <div className="flex items-center gap-1.5">
              <div className="h-7 w-7 rounded-md flex items-center justify-center">
                {favicon ? (
                  <>
                    <img 
                      src={favicon} 
                      alt={issuer} 
                      className="h-5 w-5 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '';
                          const darkMode = isDarkMode();
                          const fallback = document.createElement('div');
                          fallback.className = `h-5 w-5 rounded-sm flex items-center justify-center ${darkMode ? 'bg-white' : 'bg-black'}`;
                          fallback.innerHTML = `<span class="text-[12px] font-bold ${darkMode ? 'text-black' : 'text-white'}">${issuer.charAt(0).toUpperCase()}</span>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </>
                ) : (
                  <div className={`h-5 w-5 rounded-sm flex items-center justify-center ${isDarkMode() ? 'bg-white' : 'bg-black'}`}>
                    <span className={`text-[12px] font-bold ${isDarkMode() ? 'text-black' : 'text-white'}`}>
                      {issuer.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-base font-semibold">{issuer}</CardTitle>
                <p className="text-xs text-muted-foreground">{username}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0">
                  <MoreHorizontalIcon className="h-3 w-3" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <EditIcon className="mr-2 h-3 w-3" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                  <TrashIcon className="mr-2 h-3 w-3" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex flex-col items-center gap-3">
              <div 
                className="text-center cursor-pointer group"
                onClick={() => handleCopyCode(code, "current")}
              >
                <div className={`text-2xl font-mono font-bold tracking-widest ${copiedCode === code ? '' : 'group-hover:underline group-hover:decoration-dotted'}`}>
                  {code}
                </div>
              </div>
              <div className="relative h-14 w-14">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="100"
                    strokeDashoffset={100 - progressPercentage}
                    className={getProgressColor()}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                    style={{ 
                      transition: "stroke-dashoffset 0.3s ease-in-out, stroke 0.5s ease-in-out"
                    }}
                  />
                  <text
                    x="18"
                    y="21"
                    textAnchor="middle"
                    dy="0"
                    className="text-sm font-mono font-semibold fill-current"
                  >
                    {Math.floor(timeLeft)}
                  </text>
                </svg>
              </div>
              <div 
                className="w-full text-center cursor-pointer group -mt-1"
                onClick={() => handleCopyCode(nextCode, "next")}
              >
                <p className="text-[10px] text-muted-foreground">Next</p>
                <p className={`text-xs font-mono font-medium tracking-wider ${copiedCode === nextCode ? '' : 'group-hover:underline group-hover:decoration-dotted'}`}>
                  {nextCode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <EditAccountDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        account={{ id, issuer, username, favicon }}
        onSave={handleEdit}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        issuer={issuer}
      />
    </>
  );
}

function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

export { TOTPCard };