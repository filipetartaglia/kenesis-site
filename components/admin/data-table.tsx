import { cn } from "@/lib/utils";

type Column = {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
};

export function DataTable({ columns, data }: { columns: Column[]; data: any[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-700">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                Nenhum registro encontrado.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id || i} className="transition-colors hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-6 py-4">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
