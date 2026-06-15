<<<<<<< HEAD
// PageHeader (PRD §9 layout). Component stub — implemented in its PRD phase.
export function PageHeader() {
  return <div>PageHeader</div>;
}
=======
interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold">
        {title}
      </h2>

      {description && (
        <p className="text-gray-500 mt-1">
          {description}
        </p>
      )}
    </div>
  );
}
>>>>>>> faiz
