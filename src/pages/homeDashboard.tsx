import React from "react";
import Header from "../components/home/homeHeader";
import MainContent from "../components/home/homePage";
import Footer from "../components/ui/Footer";

const HomeDashboard: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center font-sans">
            <Header />
            <MainContent />
            <Footer />
        </div>
    );
};

export default HomeDashboard;
