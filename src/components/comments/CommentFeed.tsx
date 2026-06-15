import { Comment } from "../../types/comment";

interface CommentFeedProps {
  comments: Comment[];
}

export default function CommentFeed({
  comments,
}: CommentFeedProps) {
  if (!comments.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        No comments yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="border rounded-lg p-4 bg-white"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">
              {comment.userName}
            </span>

            <span className="text-xs text-gray-400">
              {new Date(
                comment.createdAt
              ).toLocaleString()}
            </span>
          </div>

          <p className="text-gray-700">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
}