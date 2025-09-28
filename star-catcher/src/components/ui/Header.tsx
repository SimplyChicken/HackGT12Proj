import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";


const Navbar: React.FC = () => {

    const { status } = useSession();

    return (
        <nav className="w-full bg-transparent">
            <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-12 py-8">
                {/* Brand */}
                <a
                    href="/"
                    className="font-brand text-4xl tracking-wide text-ink md:text-5xl"
                    aria-label="easel home"
                >
                    easel
                </a>

                {/* Nav links pill */}
                <div className="flex items-center gap-8 rounded-2xl bg-light px-6 py-3">

                    <Link href="/design">
                        <h1 className="font-ui text-base text-ink/90 transition-colors text-ink hover-accent"> fonts &amp; colors</h1>
                    </Link>

                    <Link href="/components">
                        <h1 className="font-ui text-base text-ink/90 transition-colors text-ink hover-accent"> components </h1>
                    </Link>

                    <Link href="/accounts">
                        <h1 className="font-ui text-base text-ink/90 transition-colors text-ink hover-accent"> {status === "authenticated" ? "profile" : "register"} </h1>
                    </Link>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;