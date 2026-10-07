import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const userId = user ? (user.id || user.email) : "guest";
  const profileKey = `unicare_profile_${userId}`;
  const familyKey = `unicare_family_${userId}`;
  const contactsKey = `unicare_contacts_${userId}`;
  const notifKey = `unicare_notifications_${userId}`;

  const [profile, setProfileState] = useState(() => {
    const saved = localStorage.getItem(profileKey) || localStorage.getItem("unicare_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email === user?.email || !user) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return {
      name: user?.name || "User",
      email: user?.email || "",
      phone: "",
      dob: "",
      gender: "",
    };
  });

  // Fresh family list with NO default family members
  const [family, setFamily] = useState(() => {
    const saved = localStorage.getItem(familyKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy hardcoded members if present
          return parsed.filter((m) => !m.includes("Rohan Sharma") && !m.includes("Aarav Sharma"));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem(contactsKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return ["Emergency Helpline - 112"];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(notifKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return { email: true, sms: false, push: true };
  });

  useEffect(() => {
    if (user) {
      setProfileState((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));

      const fetchProfile = async () => {
        try {
          const res = await api.get("/profile");
          if (res.data) {
            setProfileState((prev) => ({
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
    localStorage.setItem(profileKey, JSON.stringify(profile));
  }, [profile, profileKey]);

  useEffect(() => {
    localStorage.setItem(familyKey, JSON.stringify(family));
  }, [family, familyKey]);

  useEffect(() => {
    localStorage.setItem(contactsKey, JSON.stringify(contacts));
  }, [contacts, contactsKey]);

  useEffect(() => {
    localStorage.setItem(notifKey, JSON.stringify(notifications));
  }, [notifications, notifKey]);

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
        setNotifications,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProfile = () => useContext(ProfileContext);
