import Sidebar from "@/components/sidebar";
import React from "react";

interface HomeDrawersProps {
    sidebarVisible: boolean;
    setSidebarVisible: (visible: boolean) => void;
}

const HomeDrawers: React.FC<HomeDrawersProps> = ({
    sidebarVisible,
    setSidebarVisible,
}) => {
    return (
        <>
            <Sidebar
                visible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
            />
        </>
    );
};

export default HomeDrawers;
