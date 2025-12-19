import { noConflict } from "lodash";
import { createContext,useEffect,useState } from "react";

const NotificationContext = createContext({
notification: null,
setNotification: function(notification){},
hideNotification: () => {},


})

export const NotificationProvider = ({ children }) => {   
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000); // Auto-close after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [notification]); 
    
    const showNotification = (notification) => {
        setNotification(notification);
    }
    const hideNotification = () => {
        setNotification(null);
    }

    const context ={
        notification: notification,
        setNotification: showNotification,
        hideNotification: hideNotification,
    }
    return ( <NotificationContext.Provider value={context}>
        {children}</NotificationContext.Provider>
    )
}

export default NotificationContext;