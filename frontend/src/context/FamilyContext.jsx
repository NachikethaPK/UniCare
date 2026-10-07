import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FamilyContext = createContext();

const createFreshPrimaryProfile = (currentUser) => ({
  id: currentUser?.id ? `prof-${currentUser.id}` : "prof-self",
  name: currentUser?.name || "Primary Profile",
  relationship: "Self (Primary)",
  age: "",
  bloodGroup: "",
  role: "Family Admin",
  pinEnabled: false,
  pin: "",
  avatarColor: "bg-blue-600",
});

export function FamilyProvider({ children }) {
  const { user } = useAuth();
  const userId = user ? (user.id || user.email) : "guest";

  const vaultStorageKey = `unicare_family_vault_${userId}`;
  const profilesStorageKey = `unicare_family_profiles_${userId}`;
  const activeProfStorageKey = `unicare_active_profile_${userId}`;
  const logsStorageKey = `unicare_family_logs_${userId}`;

  // Family Vault Settings - clean and personalized for user
  const [familyVault, setFamilyVault] = useState(() => {
    const saved = localStorage.getItem(vaultStorageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      householdName: user?.name ? `${user.name}'s Family Vault` : "My Family Vault",
      inviteCode: `FAM-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      adminEmail: user?.email || "",
      createdDate: new Date().toISOString().split("T")[0],
    };
  });

  // Family Member Profiles - Start FRESH with only the primary user, NO fake family members!
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem(profilesStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If saved profiles contain old legacy fake demo members for non-demo users, strip them!
          const filtered = parsed.filter(
            (p) => p.name !== "Rohan Sharma" && p.name !== "Aarav Sharma"
          );
          if (filtered.length > 0) return filtered;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [createFreshPrimaryProfile(user)];
  });

  // Currently Active Profile ID
  const [activeProfileId, setActiveProfileId] = useState(() => {
    const saved = localStorage.getItem(activeProfStorageKey);
    return saved || (profiles[0]?.id || "prof-self");
  });

  // Family Audit Logs - clean and empty for fresh profiles
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem(logsStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy hardcoded logs about Rohan or Bruno
          return parsed.filter(
            (l) => !l.action?.includes("Bruno") && !l.user?.includes("Rohan")
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Re-sync profiles when user changes or logs into a different account
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(profilesStorageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const filtered = parsed.filter(
              (p) => p.name !== "Rohan Sharma" && p.name !== "Aarav Sharma"
            );
            if (filtered.length > 0) {
              setProfiles(filtered);
              setActiveProfileId(filtered[0].id);
              return;
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      const fresh = [createFreshPrimaryProfile(user)];
      setProfiles(fresh);
      setActiveProfileId(fresh[0].id);
    }
  }, [user, profilesStorageKey]);

  // Persist State to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(vaultStorageKey, JSON.stringify(familyVault));
      localStorage.setItem(profilesStorageKey, JSON.stringify(profiles));
      localStorage.setItem(activeProfStorageKey, activeProfileId);
      localStorage.setItem(logsStorageKey, JSON.stringify(auditLogs));
    }
  }, [familyVault, profiles, activeProfileId, auditLogs, vaultStorageKey, profilesStorageKey, activeProfStorageKey, logsStorageKey, user]);

  // Always guaranteed safe activeProfile object
  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) ||
    profiles[0] ||
    createFreshPrimaryProfile(user);

  const logActivity = (action) => {
    const newLog = {
      id: Date.now(),
      user: activeProfile?.name || "User",
      action,
      timestamp:
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        ", Today",
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  const addFamilyMemberProfile = (data) => {
    const colors = [
      "bg-blue-600",
      "bg-purple-600",
      "bg-emerald-600",
      "bg-amber-600",
      "bg-teal-600",
      "bg-rose-600",
    ];
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
              pinEnabled: updatedData.pin
                ? true
                : updatedData.pin === ""
                ? false
                : p.pinEnabled,
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
      setActiveProfileId(profiles[0]?.id || "prof-self");
    }
    logActivity(`Removed family member profile: ${target?.name || "member"}`);
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
