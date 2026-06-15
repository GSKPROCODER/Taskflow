import { useState } from "react";

import Button from "../ui/button";

interface CommentFormProps {
  onSubmit: (
    content: string
  ) => void;

  loading?: boolean;
}

export default function CommentForm({
  onSubmit,
  loading = false,
}: CommentFormProps) {
  const [content, setContent] =
    useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!content.trim()) return;

    onSubmit(content);

    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <textarea
        value={content}
        onChange={(e) =>
          setContent(
            e.target.value
          )
        }
        placeholder="Write a comment..."
        rows={4}
        className="w-full border rounded-lg p-3"
      />

      <Button
        type="submit"
        loading={loading}
      >
        Add Comment
      </Button>
    </form>
  );
}