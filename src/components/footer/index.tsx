import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-black text-white z-40">
      <div className="w-full px-4 md:px-8 lg:px-16 py-4 md:py-6 flex justify-between items-center">
        <span className="text-sm md:text-base text-left text-gray-400">
          © 2025. <span className="font-black text-white">KAGEBUNSHIN</span>
        </span>
        
        <Image 
          src="/kagebunshin-logo.png"
          alt="Kagebunshin Logo"
          width={48}
          height={48}
          className="rounded object-cover max-md:w-12 max-md:h-12"
        />
      </div>
    </footer>
  );
};