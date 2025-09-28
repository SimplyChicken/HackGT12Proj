"use client";
import React from "react";
import Link from "next/link";
import { Sparkles, Menu } from "lucide-react";
import { usePathname } from "next/navigation";


type HeaderProps = {
 onOpenMemories?: () => void;
};


export default function Header({ onOpenMemories }: HeaderProps) {
   const hideNavbarOn = ["/accounts"];
   const currentPath = usePathname();
    return (
   <header className="bg-white shadow-sm border-b border-slate-gray/20">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex justify-between items-center h-16">
         <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-gradient-to-br from-space-cadet to-slate-gray rounded-lg flex items-center justify-center">
             <Sparkles className="w-5 h-5 text-white" />
       </div>
           <Link href="/">
               <h1 className="text-xl font-bold text-space-cadet font-poly">Star Catcher</h1>
           </Link>
       </div>


         <div className="flex items-center gap-4">
           <Link href="/accounts">
             {!hideNavbarOn.includes(currentPath) && (
               <button
                 type="button"
                 className="px-4 py-2 text-sm font-medium text-space-cadet bg-slate-gray/10 rounded-md hover:bg-slate-gray/20 transition-colors font-outfit"
               >
                 Register
               </button>
             )}
           </Link>


           {onOpenMemories ? (
             <button
               onClick={onOpenMemories}
               className="flex items-center gap-2 px-3 py-2 text-sm text-slate-gray hover:text-space-cadet hover:bg-slate-gray/10 rounded-md transition-colors font-outfit"
               aria-label="Open memories"
             >
               <Menu className="w-4 h-4" />
               Memories
             </button>
           ) : null}
         </div>
       </div>
     </div>
   </header>
 );
}
