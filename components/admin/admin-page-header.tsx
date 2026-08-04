import { PageTitle } from "./page-title";

export function AdminPageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <PageTitle title={title} description={description} />
      {action && <div>{action}</div>}
    </div>
  );
}
