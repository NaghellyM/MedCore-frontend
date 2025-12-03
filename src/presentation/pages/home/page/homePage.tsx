import React from "react";
import { CarouselPlugin } from "../components/homeCarousel";

const MainContent: React.FC = () => {
    return (
        <main className="w-full pt-16 md:pt-20 px-4 sm:px-6 lg:px-8">
            <section className="mx-auto w-full max-w-7xl">
                <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">
                    <div className="w-full sm:w-[85%] md:w-[70%] lg:w-auto flex-shrink-0">
                        <CarouselPlugin />
                    </div>

                    <div className="text-left w-full max-w-none lg:max-w-xl">
                        <h1 className="text-foreground font-bold text-3xl sm:text-4xl lg:text-5xl">
                            Bienvenido a Cuidarte
                        </h1>
                        <p className="mt-4 text-base sm:text-lg leading-relaxed text-justify text-muted-foreground">
                            Bienvenido a Cuidarte, tu plataforma integral para la gestión de
                            historiales médicos y citas. Nuestra misión es facilitar la
                            comunicación entre pacientes y profesionales de la salud,
                            asegurando un acceso rápido y seguro a la información médica.
                            Explora nuestras funcionalidades y descubre cómo podemos ayudarte
                            a cuidar de tu salud de manera eficiente y confiable.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-7xl py-10 sm:py-12 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] items-center gap-6 sm:gap-8 lg:gap-12">
                <div className="md:pr-6 lg:pr-10 text-justify">
                    <h2 className="text-foreground font-semibold text-2xl sm:text-3xl">
                        ¿Por qué elegir Cuidarte?
                    </h2>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-base leading-relaxed text-muted-foreground">
                        <li>Acceso rápido a tu historial médico</li>
                        <li>Recordatorios de citas y medicamentos</li>
                        <li>Comunicación directa con profesionales de la salud</li>
                    </ul>
                </div>

                <div className="flex md:justify-end">
                    <img
                        className="mx-auto md:mx-0 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 object-contain"
                        src="/logoCuidarte.png"
                        alt="Logo de Cuidarte"
                        loading="lazy"
                    />
                </div>
            </section>
        </main>
    );
};

export default MainContent;
