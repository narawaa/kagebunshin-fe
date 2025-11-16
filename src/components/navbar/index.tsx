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
          <h1 className="md:text-lg font-semibold">Kagebunshin</h1>
        </div>

      <div className="flex items-center gap-2 md:gap-3 text-white">
        <Link href="/" className="w-32 bg-linear-to-r from-orange-600 to-orange-500 px-3 py-1 rounded-xl font-bold hover:from-orange-300 transition text-center">Search</Link>
        <Link href="/query-editor" className="w-32 bg-linear-to-r from-orange-600 to-orange-500 px-3 py-1 rounded-xl font-bold hover:from-orange-300 transition text-center">Free Query</Link>
      </div>
    </nav>
  );
};