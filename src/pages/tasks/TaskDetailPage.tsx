import { useParams } from "react-router-dom";

import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/layout/PageHeader";

import CommentFeed from "../../components/comments/CommentFeed";
import CommentForm from "../../components/comments/CommentForm";

import { useComments } from "../../hooks/useComments";

export default function TaskDetailPage() {
  const { id } = useParams();

  const {
    comments,
    createComment,
    isLoading,
  } = useComments(id || "");

  return (
    <AppShell>
      <PageHeader
        title="Task Details"
        description="Discussion and activity"
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <CommentFeed
            comments={comments}
          />

          <div className="mt-6">
            <CommentForm
              onSubmit={(content) =>
                createComment(content)
              }
            />
          </div>
        </>
      )}
    </AppShell>
  );
}