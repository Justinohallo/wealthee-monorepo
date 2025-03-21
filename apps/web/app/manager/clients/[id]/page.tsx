import ClientDetails from "../_components/ClientDetails"

export default function ClientPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Client Details</h1>
      <ClientDetails id={params.id} />
    </div>
  )
}

