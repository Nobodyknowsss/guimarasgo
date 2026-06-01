import { Facebook } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/stat-card";
import { adminCustomers, formatDate } from "@/lib/admin/data";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Customers"
        description="Everyone who has signed up to book with GuimarasGo."
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
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
            {adminCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-border last:border-0 transition-colors hover:bg-muted/40"
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
                <td className="px-5 py-3 text-muted-foreground">{customer.email}</td>
                <td className="px-5 py-3 text-muted-foreground">{customer.phone}</td>
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
                <td className="px-5 py-3 text-muted-foreground">{customer.bookings}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {formatDate(customer.joinedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
