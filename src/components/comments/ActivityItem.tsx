interface ActivityItemProps {
  user: string;
  action: string;
  timestamp: string;
}

export default function ActivityItem({
  user,
  action,
  timestamp,
}: ActivityItemProps) {
  return (
    <div className="flex justify-between items-center border-b py-3">
      <div>
        <span className="font-medium">
          {user}
        </span>

        <span className="text-gray-600 ml-2">
          {action}
        </span>
      </div>

      <span className="text-xs text-gray-400">
        {new Date(
          timestamp
        ).toLocaleString()}
      </span>
    </div>
  );
}