import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <div className="sticky px-4 py-2 left-0 right-0 top-0 z-50 flex flex-row items-center justify-between bg-neutral-100 border-b border-black/10">
      <div>
        <div className="text-xl font-bold">Only Geeks</div>
      </div>
      <div>
        <Button variant='default'>
            Sign in with Google
        </Button>
      </div>
    </div>
  )
}
