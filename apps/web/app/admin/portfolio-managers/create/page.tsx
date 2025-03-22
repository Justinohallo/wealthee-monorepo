import { Button } from "@/components/ui/button"
import CreatePortfolioManagerForm from "./_components/CreatePortfolioManagerForm"
import Link from "next/link"
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

export const CreatePage = async () => {
  const user = await verifySessionAndGetUser();
  if (!user) {
    return <div>Unauthorized</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create Portfolio Manager</h1>
      <CreatePortfolioManagerForm idToken={user.token || ''} />
      <div className="mt-6">
        <Link href="/admin/portfolio-managers">
          <Button variant="outline">Back to Portfolio Managers</Button>
        </Link>
      </div>
    </div>
  )
}

export default CreatePage

