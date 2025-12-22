import NotificationDrawer from "@/components/notification-drawer";
import Sidebar from "@/components/sidebar";
import WishlistDrawer from "@/components/wishlist-drawer";
import React from "react";

interface HomeDrawersProps {
    sidebarVisible: boolean;
    setSidebarVisible: (visible: boolean) => void;
    notificationDrawerVisible: boolean;
    setNotificationDrawerVisible: (visible: boolean) => void;
    wishlistDrawerVisible: boolean;
    setWishlistDrawerVisible: (visible: boolean) => void;
}

const HomeDrawers: React.FC<HomeDrawersProps> = ({
    sidebarVisible,
    setSidebarVisible,
    notificationDrawerVisible,
    setNotificationDrawerVisible,
    wishlistDrawerVisible,
    setWishlistDrawerVisible,
}) => {
    return (
        <>
            <Sidebar
                visible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
            />
            <NotificationDrawer
                visible={notificationDrawerVisible}
                onClose={() => setNotificationDrawerVisible(false)}
            />
            <WishlistDrawer
                visible={wishlistDrawerVisible}
                onClose={() => setWishlistDrawerVisible(false)}
            />
        </>
    );
};

export default HomeDrawers;
