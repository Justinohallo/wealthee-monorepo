import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PortfolioManager {
  uid: string
  email: string
  displayName: string
  disabled: boolean
  metadata: {
    creationTime: string
    lastSignInTime: string | null
  }
}

interface PortfolioManagerListProps {
  managers: PortfolioManager[]
}

export default function PortfolioManagerList({ managers }: PortfolioManagerListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Last Sign In</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {managers.map((manager) => (
          <TableRow key={manager.uid}>
            <TableCell>{manager.displayName}</TableCell>
            <TableCell>{manager.email}</TableCell>
            <TableCell>{new Date(manager.metadata.creationTime).toLocaleString()}</TableCell>
            <TableCell>
              {manager.metadata.lastSignInTime ? new Date(manager.metadata.lastSignInTime).toLocaleString() : "Never"}
            </TableCell>
            <TableCell>{manager.disabled ? "Disabled" : "Active"}</TableCell>
            <TableCell>
              <div className="space-x-2">
                <Link href={`/admin/portfolio-managers/${manager.uid}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Link href={`/admin/portfolio-managers/delete/${manager.uid}`}>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

