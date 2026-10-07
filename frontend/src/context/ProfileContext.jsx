import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  
  const [profile, setProfileState] = useState(() => {
    const saved = localStorage.getItem("unicare_profile");
    return saved ? JSON.parse(saved) : {
      name: "Chandrika Sharma",
      email: "chandrika@example.com",
      phone: "+91 98765 43210",
      dob: "1995-06-15",
      gender: "Female",
    };
  });
  
  const [family, setFamily] = useState(() => {
    const saved = localStorage.getItem("unicare_family");
    return saved ? JSON.parse(saved) : ["Rohan Sharma (Spouse)", "Aarav Sharma (Son)"];
  });
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem("unicare_contacts");
    return saved ? JSON.parse(saved) : ["Dr. Ananya Rao - +91 98765 00000", "Emergency Helpline - 112"];
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("unicare_notifications");
    return saved ? JSON.parse(saved) : { email: true, sms: false, push: true };
  });

  useEffect(() => {
    if (user) {
      setProfileState((prev) => ({ 
        ...prev, 
        name: user.name || prev.name, 
        email: user.email || prev.email 
      }));
      
      const fetchProfile = async () => {
        try {
          const res = await api.get("/profile");
          if (res.data) {
            setProfileState(prev => ({
              ...prev,
              phone: res.data.phone || prev.phone,
              dob: res.data.dob || prev.dob,
              gender: res.data.gender || prev.gender,
            }));
            if (res.data.family?.length) setFamily(res.data.family);
            if (res.data.contacts?.length) setContacts(res.data.contacts);
            if (res.data.notifications) setNotifications(res.data.notifications);
          }
        } catch (error) {
          console.warn("Using local profile state:", error.message);
        }
      };
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("unicare_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("unicare_family", JSON.stringify(family));
  }, [family]);

  useEffect(() => {
    localStorage.setItem("unicare_contacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("unicare_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const updateProfileData = async (newProfileData) => {
    setProfileState(newProfileData);
    try {
      await api.put("/profile", newProfileData);
    } catch (error) {
      console.warn("Updated profile locally:", error.message);
    }
  };

  return (
    <ProfileContext.Provider 
      value={{ 
        profile, 
        setProfile: updateProfileData, 
        family, 
        setFamily,
        contacts, 
        setContacts, 
        notifications, 
        setNotifications 
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProfile = () => useContext(ProfileContext);

