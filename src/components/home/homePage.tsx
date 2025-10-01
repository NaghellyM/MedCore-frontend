import React from "react";
import { CarouselPlugin } from "./homeCarousel";

const MainContent: React.FC = () => {
    return (
        <main className="w-full pt-24 px-4">
            <section className="mx-auto w-full max-w-7xl flex flex-row gap-x-20 lg:flex-row">
                <div className="flex-1 flex flex-row items-center gap-20">
                    <CarouselPlugin />
                    <div className="text-left max-w-xl">
                        <h1 className="text-4xl font-bold mb-4">Bienvenido a Cuidarte</h1>
                        <p className="text-lg text-gray-700 text-justify">
                            Bienvenido a Cuidarte, tu plataforma integral para la gestión de historiales médicos y citas.
                            Nuestra misión es facilitar la comunicación entre pacientes y profesionales de la salud,
                            asegurando un acceso rápido y seguro a la información médica. Explora nuestras funcionalidades
                            y descubre cómo podemos ayudarte a cuidar de tu salud de manera eficiente y confiable.
                        </p>
                    </div>
                </div>
            </section>

            <section className="flex items-center justify-center min-h-[220px] text-justify">
                <div className="pr-10">
                    <h2 className="text-2xl font-semibold">¿Por qué elegir Cuidarte?</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Acceso rápido a tu historial médico</li>
                        <li>Recordatorios de citas y medicamentos</li>
                        <li>Comunicación directa con profesionales de la salud</li>
                    </ul>
                </div>
                <img className="w-45 h-45" src="/src/assets/images/Cuidarte_vive_al_100.png" alt="Logo" />
            </section>

        </main>
    );
};

export default MainContent;
