import Home from "@/components/Home";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { User } from "@/lib/types";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <Home user={session.user as User}/>
}
