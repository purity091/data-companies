"use client";

import Link from "next/link";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TrustMrrSummary } from "@/modules/companies/company.types";

export type CompanyTableRow = {
  id: string;
  slug: string;
  name: string;
  legalName: string | null;
  description: string | null;
  websiteUrl: string | null;
  logoUrl?: string | null;
  foundedYear: number | null;
  trustmrrSlug?: string | null;
  createdAt: string;
  updatedAt: string;
  country: { name: string } | null;
  industry: { name: string } | null;
  trustmrr: TrustMrrSummary | null;
};

type Props = {
  companies: CompanyTableRow[];
  loading: boolean;
};

const columnHelper = createColumnHelper<CompanyTableRow>();

function money(cents: string | number | null | undefined) {
  if (cents === null || cents === undefined || cents === "") return "—";
  return `$${(Number(cents) / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function integer(value: number | null | undefined) {
  return value === null || value === undefined ? "—" : value.toLocaleString("en-US");
}

function growth(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  const number = Number(value);
  return `${number > 0 ? "+" : ""}${number.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
}

function date(value: string) {
  return new Intl.DateTimeFormat("ar-u-nu-latn", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function SortableHeader({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <ArrowUpDown className="size-3.5 text-muted-foreground" />
    </span>
  );
}

export function CompanyDataTable({ companies, loading }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "updatedAt", desc: true }]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <SortableHeader label="الشركة" />,
        cell: ({ row }) => {
          const company = row.original;
          return (
            <div className="flex min-w-56 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sky-100 text-sm font-black text-sky-700">
                {company.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={company.logoUrl} alt="" className="size-full object-cover" />
                ) : (
                  company.name.slice(0, 1).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <Link href={`/companies/${company.id}`} className="block truncate font-bold text-slate-950 hover:text-sky-700">
                  {company.name}
                </Link>
                <p className="truncate text-xs text-muted-foreground">{company.trustmrrSlug || company.slug}</p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor((row) => row.country?.name || "", {
        id: "country",
        header: () => <SortableHeader label="الدولة" />,
        cell: ({ row }) => row.original.country?.name || "—",
      }),
      columnHelper.accessor((row) => row.industry?.name || "", {
        id: "industry",
        header: () => <SortableHeader label="الصناعة" />,
        cell: ({ row }) => row.original.industry?.name || "—",
      }),
      columnHelper.accessor((row) => Number(row.trustmrr?.revenueMrrCents ?? -1), {
        id: "mrr",
        header: () => <SortableHeader label="MRR" />,
        cell: ({ row }) => <span className="font-semibold">{money(row.original.trustmrr?.revenueMrrCents)}</span>,
      }),
      columnHelper.accessor((row) => Number(row.trustmrr?.revenueLast30DaysCents ?? -1), {
        id: "revenue30d",
        header: () => <SortableHeader label="إيراد 30 يومًا" />,
        cell: ({ row }) => money(row.original.trustmrr?.revenueLast30DaysCents),
      }),
      columnHelper.accessor((row) => row.trustmrr?.customers ?? -1, {
        id: "customers",
        header: () => <SortableHeader label="العملاء" />,
        cell: ({ row }) => integer(row.original.trustmrr?.customers),
      }),
      columnHelper.accessor((row) => Number(row.trustmrr?.growth30d ?? -999), {
        id: "growth",
        header: () => <SortableHeader label="النمو" />,
        cell: ({ row }) => {
          const value = row.original.trustmrr?.growth30d;
          return <span className={Number(value) >= 0 ? "text-emerald-700" : "text-rose-700"}>{growth(value)}</span>;
        },
      }),
      columnHelper.accessor("updatedAt", {
        header: () => <SortableHeader label="آخر تحديث" />,
        cell: ({ row }) => <time dateTime={row.original.updatedAt}>{date(row.original.updatedAt)}</time>,
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <Link href={`/companies/${row.original.id}`} aria-label={`فتح ${row.original.name}`}>
            <ExternalLink className="size-4 text-sky-700" />
          </Link>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: companies,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-950">الشركات المستوردة حديثًا</h2>
          <p className="mt-1 text-sm text-muted-foreground">اضغط على عنوان أي عمود لترتيب البيانات وفهم آخر تحديث.</p>
        </div>
        <Badge variant="secondary">{companies.length.toLocaleString("en-US")} شركة معروضة</Badge>
      </div>

      <Table>
        <TableHeader className="bg-slate-50/80">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="px-4 py-3 text-right text-xs font-bold text-slate-500">
                  {header.isPlaceholder ? null : (
                    <button
                      type="button"
                      className={header.column.getCanSort() ? "cursor-pointer hover:text-sky-700" : "cursor-default"}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </button>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="text-right">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-4 text-right text-sm text-slate-600">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                لا توجد شركات مطابقة.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {loading && companies.length > 0 && (
        <div className="flex items-center justify-center gap-2 border-t border-slate-100 px-5 py-4 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> جارٍ تحديث البيانات...
        </div>
      )}
    </section>
  );
}
