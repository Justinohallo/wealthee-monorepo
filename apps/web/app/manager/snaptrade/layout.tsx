"use client"

import { usePathname } from "next/navigation"

export default function SnaptradeLayout({
  children,
  users,
}: {
  children: React.ReactNode
  users: React.ReactNode
}) {
  const pathname = usePathname()
  const isUserDetailPage = pathname.includes('/manager/snaptrade/')

  return (
    <>
      {children}
      {!isUserDetailPage && users}
    </>
  )
}
