import { redirect } from "next/navigation"

export default function Default() {
    // Redirect to the main snaptrade page if someone tries to access this route directly
    redirect("/manager/snaptrade")
}
