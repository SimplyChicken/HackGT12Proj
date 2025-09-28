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
   <header className="bg-white shadow-sm border-b border-gray-200">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex justify-between items-center h-16">
         <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
             <Sparkles className="w-5 h-5 text-white" />
       </div>
           <Link href="/">
               <h1 className="text-xl font-bold text-gray-900">Star Catcher</h1>
           </Link>
       </div>


         <div className="flex items-center gap-4">
           <Link href="/accounts">
             {!hideNavbarOn.includes(currentPath) && (
               <button
                 type="button"
                 className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
               >
                 Sign in
               </button>
             )}
           </Link>


           {onOpenMemories ? (
             <button
               onClick={onOpenMemories}
               className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
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
