import { type JSX } from "react";

export const Layout = ({
    children,
}: {
    children: JSX.Element | JSX.Element[];
}) => {
    return (
        <>
            <h1 className="text-center text-5xl font-fjalla text-cuidarte-primary">
                <span>Cuidarte</span>
            </h1>
            <main className="grid place-items-center justify-items-center">
                {children}
            </main>
        </>
    );
};
