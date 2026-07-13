import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Removed unused z import
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/hooks/useProjects";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  createProjectSchema,
  type CreateProjectInput,
} from "../../../server/validators/project.schema";

type FormValues = CreateProjectInput;

/** Create-project dialog. */
export function ProjectForm({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(createProjectSchema) });

  const createProject = useCreateProject();

  const onSubmit = (values: FormValues) => {
    createProject.mutate(values, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
      onError: (err) => {
        console.error("Failed to create project", err);
        // Could show a toast error here
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus /> New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Projects group related tasks. Only Team Leads can create them.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Craftboard Project"
              className={
                errors.name
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
              {...register("name")}
            />
            {errors.name && (
              <p className="flex items-center gap-1 text-[13px] font-medium text-destructive mt-1">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive/10">
                  !
                </span>
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What is this project about?"
              {...register("description")}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
