import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const BloodDonationContext = createContext();

const defaultDonors = [
  { id: "d-1", name: "Rahul Verma", bloodGroup: "B+", age: 28, location: "Indiranagar, Bangalore", phone: "+91 98765 43210", availability: "Available" },
  { id: "d-2", name: "Sneha Patel", bloodGroup: "O-", age: 25, location: "Koramangala, Bangalore", phone: "+91 98123 45678", availability: "Available" },
  { id: "d-3", name: "Amit Kumar", bloodGroup: "A+", age: 32, location: "Whitefield, Bangalore", phone: "+91 97890 12345", availability: "Available" },
];

const defaultRequests = [
  { id: "r-1", patient: "Priya Reddy", bloodGroup: "B+", hospital: "Apollo Hospital", location: "Bangalore", contact: "+91 91234 56789", urgency: "Urgent", status: "Pending" },
  { id: "r-2", patient: "Arjun Kumar", bloodGroup: "O-", hospital: "KIMS Hospital", location: "Bangalore", contact: "+91 92345 67890", urgency: "Normal", status: "Accepted" },
];

export function BloodDonationProvider({ children }) {
  const { user } = useAuth();
  const [donors, setDonors] = useState(() => {
    const saved = localStorage.getItem("unicare_donors");
    return saved ? JSON.parse(saved) : defaultDonors;
  });
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("unicare_requests");
    return saved ? JSON.parse(saved) : defaultRequests;
  });

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [donorsRes, requestsRes] = await Promise.all([
            api.get("/blood/donors"),
            api.get("/blood/requests")
          ]);
          if (donorsRes.data?.length > 0) setDonors(donorsRes.data.map(d => ({...d, id: d._id})));
          if (requestsRes.data?.length > 0) setRequests(requestsRes.data.map(r => ({...r, id: r._id})));
        } catch (error) {
          console.warn("Using local blood donation state:", error.message);
        }
      };
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("unicare_donors", JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem("unicare_requests", JSON.stringify(requests));
  }, [requests]);

  const addDonor = async (data) => {
    const newDonor = { ...data, id: "d-" + Date.now(), availability: "Available" };
    try {
      const res = await api.post("/blood/donors", data);
      if (res.data?._id) newDonor.id = res.data._id;
    } catch (error) {
      console.warn("Added donor locally:", error.message);
    }
    setDonors((items) => [newDonor, ...items]);
  };

  const addRequest = async (data) => {
    const newReq = { ...data, id: "r-" + Date.now(), status: "Pending" };
    try {
      const res = await api.post("/blood/requests", data);
      if (res.data?._id) newReq.id = res.data._id;
    } catch (error) {
      console.warn("Added request locally:", error.message);
    }
    setRequests((items) => [newReq, ...items]);
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await api.patch(`/blood/requests/${id}/status`, { status });
    } catch (error) {
      console.warn("Updated request status locally:", error.message);
    }
    setRequests((items) => items.map((item) => item.id === id ? { ...item, status } : item));
  };

  return <BloodDonationContext.Provider value={{ donors, requests, addDonor, addRequest, updateRequestStatus }}>{children}</BloodDonationContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBloodDonation = () => useContext(BloodDonationContext);

