import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/** Add-comment composer (UI only — clears on submit for this pass). */
export function CommentForm() {
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    console.info("add comment", value);
    setValue("");
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Write a comment…"
        className="min-h-[72px]"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!value.trim()}>
          <SendHorizontal /> Comment
        </Button>
      </div>
    </form>
  );
}
