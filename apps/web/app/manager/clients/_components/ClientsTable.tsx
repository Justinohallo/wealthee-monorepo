"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { ClientData } from "@/types/client";
import { EditClientButton } from "./EditClientButton";
import { ViewClientButton } from "./ViewClientButton";
import { formatDate } from "@/lib/format-date";

interface ClientsTableProps {
  clients: ClientData[];
}

export default function ClientsTable({ clients }: ClientsTableProps) {
  if (clients.length === 0) {
    return <div className="text-center p-6">No clients found. Add a client to get started.</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "inactive":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Client ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[150px]">Created At</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.id.slice(0, 8)}...</TableCell>
              <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>
                {getStatusBadge(client.status)}
              </TableCell>
              <TableCell>{formatDate(client.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <ViewClientButton clientId={client.id} />
                  <EditClientButton clientId={client.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
