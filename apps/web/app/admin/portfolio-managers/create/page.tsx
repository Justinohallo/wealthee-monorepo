import Link from "next/link"
import { Button } from "@/components/ui/button"
import CreatePortfolioManagerForm from "./_components/CreatePortfolioManagerForm"

export const CreatePage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create Portfolio Manager</h1>
      <CreatePortfolioManagerForm />
      <div className="mt-6">
        <Link href="/admin/portfolio-managers">
          <Button variant="outline">Back to Portfolio Managers</Button>
        </Link>
      </div>
    </div>
  )
}

export default CreatePage

