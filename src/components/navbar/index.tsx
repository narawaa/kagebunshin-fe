import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="w-full bg-black text-white border-b border-neutral-800 px-4 md:px-8 lg:px-16 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
          <Image 
            src="/kagebunshin-logo.png"
            alt="Kagebunshin Logo"
            width={32}
            height={32}
            className="rounded object-cover max-md:w-8 max-md:h-8"
          />
          <h1 className="text-sm md:text-lg font-bold">Kagebunshin</h1>
        </div>

      <div className="flex items-center gap-1 md:gap-3 text-orange-300 md:text-white text-sm md:text-md max-md:underline max-md:underline-offset-4">
        <Link href="/" className="md:w-32 md:bg-linear-to-r md:from-orange-600 md:to-orange-500 px-3 py-1 rounded-xl font-bold hover:from-orange-300 text-center">Search</Link>
        <Link href="/query-editor" className="md:w-32 md:bg-linear-to-r md:from-orange-600 md:to-orange-500 px-3 py-1 rounded-xl font-bold hover:from-orange-300 text-center">Query Editor</Link>
      </div>
    </nav>
  );
};