import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FamilyContext = createContext();

const defaultInitialProfiles = [
  {
    id: "prof-self",
    name: "Chandrika Sharma",
    relationship: "Self (Primary)",
    age: "29",
    bloodGroup: "O+",
    role: "Family Admin",
    pinEnabled: false,
    pin: "",
    avatarColor: "bg-blue-600",
  },
  {
    id: "prof-spouse",
    name: "Rohan Sharma",
    relationship: "Spouse",
    age: "32",
    bloodGroup: "A+",
    role: "Family Member",
    pinEnabled: true,
    pin: "1234",
    avatarColor: "bg-purple-600",
  },
  {
    id: "prof-child",
    name: "Aarav Sharma",
    relationship: "Son",
    age: "6",
    bloodGroup: "O+",
    role: "Family Member",
    pinEnabled: false,
    pin: "",
    avatarColor: "bg-emerald-600",
  },
];

const defaultAuditLogs = [
  { id: 1, user: "Rohan Sharma", action: "Booked Vet Consultation for Bruno", timestamp: "Today, 02:30 PM" },
  { id: 2, user: "Chandrika Sharma", action: "Updated Appointment Reminder with Dr. Ananya Rao", timestamp: "Yesterday, 11:15 AM" },
  { id: 3, user: "Chandrika Sharma", action: "Generated Family Vault Invite Code", timestamp: "Aug 04, 2026" },
];

export function FamilyProvider({ children }) {
  const { user } = useAuth();
  const userId = user ? (user.id || user.email) : "guest";

  const vaultStorageKey = `unicare_family_vault_${userId}`;
  const profilesStorageKey = `unicare_family_profiles_${userId}`;
  const activeProfStorageKey = `unicare_active_profile_${userId}`;
  const logsStorageKey = `unicare_family_logs_${userId}`;

  // Family Vault Settings
  const [familyVault, setFamilyVault] = useState(() => {
    const saved = localStorage.getItem(vaultStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      householdName: "Sharma Family Vault",
      inviteCode: "FAM-UNICARE-8921",
      adminEmail: user?.email || "chandrika@example.com",
      createdDate: "2026-08-01",
    };
  });

  // Family Member Profiles
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem(profilesStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultInitialProfiles;
  });

  // Currently Active Profile
  const [activeProfileId, setActiveProfileId] = useState(() => {
    const saved = localStorage.getItem(activeProfStorageKey);
    return saved || "prof-self";
  });

  // Family Audit Logs
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem(logsStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultAuditLogs;
  });

  // Persist State
  useEffect(() => {
    if (user) {
      localStorage.setItem(vaultStorageKey, JSON.stringify(familyVault));
      localStorage.setItem(profilesStorageKey, JSON.stringify(profiles));
      localStorage.setItem(activeProfStorageKey, activeProfileId);
      localStorage.setItem(logsStorageKey, JSON.stringify(auditLogs));
    }
  }, [familyVault, profiles, activeProfileId, auditLogs, vaultStorageKey, profilesStorageKey, activeProfStorageKey, logsStorageKey, user]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || defaultInitialProfiles[0];

  const logActivity = (action) => {
    const newLog = {
      id: Date.now(),
      user: activeProfile.name,
      action,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", Today",
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  const addFamilyMemberProfile = (data) => {
    const colors = ["bg-blue-600", "bg-purple-600", "bg-emerald-600", "bg-amber-600", "bg-teal-600", "bg-rose-600"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newProfile = {
      id: "prof-" + Date.now(),
      name: data.name,
      relationship: data.relationship || "Family Member",
      age: data.age || "N/A",
      bloodGroup: data.bloodGroup || "O+",
      role: "Family Member",
      pinEnabled: !!data.pin,
      pin: data.pin || "",
      avatarColor: randomColor,
    };

    setProfiles((prev) => [...prev, newProfile]);
    logActivity(`Added new family member profile: ${data.name}`);
    return newProfile;
  };

  const updateProfilePin = (profileId, pin) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? { ...p, pinEnabled: !!pin, pin: pin || "" }
          : p
      )
    );
    const target = profiles.find((p) => p.id === profileId);
    logActivity(`Updated security PIN settings for ${target?.name || "family member"}`);
  };

  const switchProfile = (profileId, inputPin = "") => {
    const target = profiles.find((p) => p.id === profileId);
    if (!target) return { success: false, message: "Profile not found" };

    if (target.pinEnabled && target.pin) {
      if (inputPin !== target.pin) {
        return { success: false, message: "Incorrect 4-digit PIN! Access denied." };
      }
    }

    setActiveProfileId(profileId);
    logActivity(`Switched active profile to ${target.name}`);
    return { success: true };
  };

  const updateFamilyMemberProfile = (profileId, updatedData) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? { 
              ...p, 
              ...updatedData, 
              pinEnabled: updatedData.pin ? true : (updatedData.pin === "" ? false : p.pinEnabled) 
            }
          : p
      )
    );
    logActivity(`Updated profile details for ${updatedData.name || "family member"}`);
  };

  const deleteProfile = (profileId) => {
    if (profiles.length <= 1) return;
    const target = profiles.find((p) => p.id === profileId);
    setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    if (activeProfileId === profileId) {
      setActiveProfileId(profiles[0].id);
    }
    logActivity(`Removed family member profile: ${target?.name}`);
  };

  return (
    <FamilyContext.Provider
      value={{
        familyVault,
        profiles,
        activeProfile,
        auditLogs,
        switchProfile,
        addFamilyMemberProfile,
        updateFamilyMemberProfile,
        updateProfilePin,
        deleteProfile,
        logActivity,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFamily = () => useContext(FamilyContext);
