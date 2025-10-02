import React from "react";
import Header from "./components/homeHeader";
import MainContent from "./page/homePage";
import Footer from "../../components/globals/footer";

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
