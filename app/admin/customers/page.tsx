import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Facebook } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/stat-card";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminCustomers } from "@/services/bookings/admin";
import { formatDate, type AdminCustomer } from "@/lib/admin/data";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Customers"
        description="Everyone who has signed up to book with GuimarasGo."
      />
      <Suspense
        fallback={<div className="h-64 w-full animate-pulse rounded-2xl bg-muted" />}
      >
        <CustomersLoader />
      </Suspense>
    </div>
  );
}

async function CustomersLoader() {
  await connection();
  const auth = await requireAdmin();
  if (!auth.ok) {
    redirect(auth.status === 401 ? "/auth/login?next=/admin/customers" : "/");
  }

  const customers = await getAdminCustomers();
  return <CustomersView customers={customers} />;
}

function CustomersView({ customers }: { customers: AdminCustomer[] }) {
  if (customers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm font-medium text-foreground">No customers yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign-ups will show up here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile / tablet: cards */}
      <div className="grid gap-3 sm:grid-cols-2 md:hidden">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {customer.firstName[0]}
                {customer.lastName[0]}
              </span>
              <div className="min-w-0">
                <div className="truncate font-medium text-foreground">
                  {customer.firstName} {customer.lastName}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {customer.email}
                </div>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Phone</dt>
                <dd className="text-foreground">{customer.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Bookings</dt>
                <dd className="text-foreground">{customer.bookings}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Joined</dt>
                <dd className="text-foreground">
                  {formatDate(customer.joinedAt)}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">Facebook</dt>
                <dd className="truncate text-foreground">
                  {customer.facebook ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Facebook className="h-3.5 w-3.5 shrink-0" />
                      {customer.facebook}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60">—</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Facebook</th>
              <th className="px-5 py-3 font-medium">Bookings</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-border transition-colors last:border-0 hover:bg-muted/40"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {customer.firstName[0]}
                      {customer.lastName[0]}
                    </span>
                    <span className="font-medium text-foreground">
                      {customer.firstName} {customer.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {customer.email}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {customer.phone || "—"}
                </td>
                <td className="px-5 py-3">
                  {customer.facebook ? (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Facebook className="h-3.5 w-3.5" />
                      {customer.facebook}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {customer.bookings}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {formatDate(customer.joinedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
