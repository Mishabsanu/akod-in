import { redirect } from "next/navigation";

// Orders are placed on WhatsApp now; old /cart links go to the home page.
export default function CartPage() {
  redirect("/");
}
