import { createContext, useContext, useState, useEffect, useMemo } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const BloodDonationContext = createContext();

const initialHospitals = [
  {
    id: "hosp-apollo",
    name: "Apollo Multispeciality Hospital",
    address: "154/11, Bannerghatta Main Rd, Bengaluru",
    city: "Bangalore",
    lat: 12.8932,
    lng: 77.5975,
    phone: "+91 80 2630 4050",
    emergencyContact: "+91 80 2630 4055",
    type: "Super Speciality",
    accreditation: "NABH / JCI",
  },
  {
    id: "hosp-manipal",
    name: "Manipal Hospital",
    address: "98, HAL Old Airport Rd, Kodihalli, Bengaluru",
    city: "Bangalore",
    lat: 12.9592,
    lng: 77.6496,
    phone: "+91 80 2502 4444",
    emergencyContact: "+91 80 2502 4455",
    type: "Multi Speciality",
    accreditation: "NABH",
  },
  {
    id: "hosp-fortis",
    name: "Fortis Hospital",
    address: "14, Cunningham Rd, Vasanth Nagar, Bengaluru",
    city: "Bangalore",
    lat: 12.9866,
    lng: 77.5982,
    phone: "+91 80 4199 4444",
    emergencyContact: "+91 80 4199 4400",
    type: "Cardiac & Neuro Care",
    accreditation: "NABH",
  },
  {
    id: "hosp-victoria",
    name: "Victoria Hospital & BMCRI Blood Bank",
    address: "Fort, near City Market, Kalasipalya, Bengaluru",
    city: "Bangalore",
    lat: 12.9629,
    lng: 77.5746,
    phone: "+91 80 2670 1150",
    emergencyContact: "+91 80 2670 1155",
    type: "Govt Medical College",
    accreditation: "State Blood Transfusion Council",
  },
  {
    id: "hosp-narayana",
    name: "Narayana Institute of Cardiac Sciences",
    address: "258/A, Bommasandra Industrial Area, Bengaluru",
    city: "Bangalore",
    lat: 12.8227,
    lng: 77.6882,
    phone: "+91 80 7122 2222",
    emergencyContact: "+91 80 7122 2233",
    type: "Cardiac & Transplant",
    accreditation: "NABH / JCI",
  },
  {
    id: "hosp-aster",
    name: "Aster CMI Hospital",
    address: "No. 43/42, NH 44, Sahakar Nagar, Hebbal, Bengaluru",
    city: "Bangalore",
    lat: 13.0538,
    lng: 77.5927,
    phone: "+91 80 4344 4444",
    emergencyContact: "+91 80 4344 4455",
    type: "Quaternary Care",
    accreditation: "NABH",
  },
];

const initialRequests = [
  {
    id: "req-1",
    hospitalId: "hosp-apollo",
    hospitalName: "Apollo Multispeciality Hospital",
    hospitalAddress: "154/11, Bannerghatta Main Rd, Bengaluru",
    lat: 12.8932,
    lng: 77.5975,
    patient: "Ramesh Rao",
    bloodGroup: "O-",
    unitsNeeded: 2,
    urgency: "Critical",
    department: "Cardiac ICU Ward",
    contact: "+91 80 2630 4055",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "req-2",
    hospitalId: "hosp-apollo",
    hospitalName: "Apollo Multispeciality Hospital",
    hospitalAddress: "154/11, Bannerghatta Main Rd, Bengaluru",
    lat: 12.8932,
    lng: 77.5975,
    patient: "Kavita S.",
    bloodGroup: "B+",
    unitsNeeded: 1,
    urgency: "Urgent",
    department: "Emergency Ward 3",
    contact: "+91 80 2630 4055",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "req-3",
    hospitalId: "hosp-manipal",
    hospitalName: "Manipal Hospital",
    hospitalAddress: "98, HAL Old Airport Rd, Kodihalli, Bengaluru",
    lat: 12.9592,
    lng: 77.6496,
    patient: "Ananya Sen",
    bloodGroup: "AB-",
    unitsNeeded: 1,
    urgency: "Critical",
    department: "Pediatric Intensive Care",
    contact: "+91 80 2502 4455",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: "req-4",
    hospitalId: "hosp-manipal",
    hospitalName: "Manipal Hospital",
    hospitalAddress: "98, HAL Old Airport Rd, Kodihalli, Bengaluru",
    lat: 12.9592,
    lng: 77.6496,
    patient: "Manoj K.",
    bloodGroup: "A+",
    unitsNeeded: 3,
    urgency: "Urgent",
    department: "Surgery OT 4",
    contact: "+91 80 2502 4455",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: "req-5",
    hospitalId: "hosp-fortis",
    hospitalName: "Fortis Hospital",
    hospitalAddress: "14, Cunningham Rd, Vasanth Nagar, Bengaluru",
    lat: 12.9866,
    lng: 77.5982,
    patient: "Pooja Hegde",
    bloodGroup: "B-",
    unitsNeeded: 2,
    urgency: "Critical",
    department: "Neurotrauma ICU",
    contact: "+91 80 4199 4400",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "req-6",
    hospitalId: "hosp-fortis",
    hospitalName: "Fortis Hospital",
    hospitalAddress: "14, Cunningham Rd, Vasanth Nagar, Bengaluru",
    lat: 12.9866,
    lng: 77.5982,
    patient: "Suresh Nair",
    bloodGroup: "O+",
    unitsNeeded: 4,
    urgency: "Urgent",
    department: "Organ Transplant Unit",
    contact: "+91 80 4199 4400",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: "req-7",
    hospitalId: "hosp-victoria",
    hospitalName: "Victoria Hospital & BMCRI Blood Bank",
    hospitalAddress: "Fort, near City Market, Kalasipalya, Bengaluru",
    lat: 12.9629,
    lng: 77.5746,
    patient: "Gopal Krishna",
    bloodGroup: "A-",
    unitsNeeded: 2,
    urgency: "Critical",
    department: "Burns & Trauma Ward",
    contact: "+91 80 2670 1155",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "req-8",
    hospitalId: "hosp-victoria",
    hospitalName: "Victoria Hospital & BMCRI Blood Bank",
    hospitalAddress: "Fort, near City Market, Kalasipalya, Bengaluru",
    lat: 12.9629,
    lng: 77.5746,
    patient: "Meera Bai",
    bloodGroup: "B+",
    unitsNeeded: 3,
    urgency: "Urgent",
    department: "Maternity Ward 2",
    contact: "+91 80 2670 1155",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
  },
  {
    id: "req-9",
    hospitalId: "hosp-narayana",
    hospitalName: "Narayana Institute of Cardiac Sciences",
    hospitalAddress: "258/A, Bommasandra Industrial Area, Bengaluru",
    lat: 12.8227,
    lng: 77.6882,
    patient: "Siddharth Jain",
    bloodGroup: "O-",
    unitsNeeded: 3,
    urgency: "Critical",
    department: "Cardiac Cath Lab",
    contact: "+91 80 7122 2233",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
  },
  {
    id: "req-10",
    hospitalId: "hosp-aster",
    hospitalName: "Aster CMI Hospital",
    hospitalAddress: "No. 43/42, NH 44, Sahakar Nagar, Hebbal, Bengaluru",
    lat: 13.0538,
    lng: 77.5927,
    patient: "Harish Rao",
    bloodGroup: "AB+",
    unitsNeeded: 2,
    urgency: "Urgent",
    department: "Nephrology Care",
    contact: "+91 80 4344 4455",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

const defaultDonors = [
  { id: "d-1", name: "Rahul Verma", bloodGroup: "B+", age: 28, location: "Indiranagar, Bangalore", phone: "+91 98765 43210", availability: "Available" },
  { id: "d-2", name: "Sneha Patel", bloodGroup: "O-", age: 25, location: "Koramangala, Bangalore", phone: "+91 98123 45678", availability: "Available" },
  { id: "d-3", name: "Amit Kumar", bloodGroup: "A+", age: 32, location: "Whitefield, Bangalore", phone: "+91 97890 12345", availability: "Available" },
  { id: "d-4", name: "Deepak Shenoy", bloodGroup: "AB-", age: 29, location: "Jayanagar, Bangalore", phone: "+91 98450 11223", availability: "Available" },
  { id: "d-5", name: "Pooja Reddy", bloodGroup: "O+", age: 26, location: "HSR Layout, Bangalore", phone: "+91 99001 88776", availability: "Available" },
];

export function BloodDonationProvider({ children }) {
  const { user } = useAuth();

  // User live location (default: Bangalore center)
  const [userLocation, setUserLocation] = useState({
    lat: 12.9716,
    lng: 77.5946,
    name: "Bangalore Central, Karnataka",
    isDetected: false,
  });

  const [hospitals, setHospitals] = useState(() => {
    const saved = localStorage.getItem("unicare_hospitals");
    return saved ? JSON.parse(saved) : initialHospitals;
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("unicare_hospital_requests");
    return saved ? JSON.parse(saved) : initialRequests;
  });

  const [donors, setDonors] = useState(() => {
    const saved = localStorage.getItem("unicare_donors");
    return saved ? JSON.parse(saved) : defaultDonors;
  });

  // Automatically detect user location once if permitted
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            name: "Your Live Location (GPS)",
            isDetected: true,
          });
        },
        (err) => {
          console.log("GPS not granted, using default city coordinates:", err.message);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  // Save local caches
  useEffect(() => {
    localStorage.setItem("unicare_hospitals", JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem("unicare_hospital_requests", JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem("unicare_donors", JSON.stringify(donors));
  }, [donors]);

  // Sync with backend API when user token is present
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [donorsRes, requestsRes] = await Promise.all([
            api.get("/blood/donors").catch(() => ({ data: [] })),
            api.get("/blood/requests").catch(() => ({ data: [] })),
          ]);

          if (donorsRes.data?.length > 0) {
            setDonors((prev) => {
              const ids = new Set(donorsRes.data.map((d) => d._id));
              return [...donorsRes.data.map((d) => ({ ...d, id: d._id })), ...prev.filter((d) => !ids.has(d.id))];
            });
          }

          if (requestsRes.data?.length > 0) {
            setRequests((prev) => {
              const ids = new Set(requestsRes.data.map((r) => r._id));
              return [...requestsRes.data.map((r) => ({ ...r, id: r._id })), ...prev.filter((r) => !ids.has(r.id))];
            });
          }
        } catch (error) {
          console.warn("Using local blood state:", error.message);
        }
      };
      fetchData();
    }
  }, [user]);

  // If a hospital user is logged in and not in the hospitals list, register it dynamically
  useEffect(() => {
    if (user?.role === "hospital" && user?.hospitalDetails) {
      setHospitals((prev) => {
        const exists = prev.some((h) => h.id === user.id || h.name.toLowerCase() === user.name.toLowerCase());
        if (!exists) {
          const newHosp = {
            id: user.id,
            name: user.name,
            address: user.hospitalDetails.address || "Medical Complex",
            city: user.hospitalDetails.city || "Bangalore",
            lat: Number(user.hospitalDetails.lat) || 12.9716,
            lng: Number(user.hospitalDetails.lng) || 77.5946,
            phone: user.hospitalDetails.phone || user.hospitalDetails.emergencyContact || "+91 80 0000 0000",
            emergencyContact: user.hospitalDetails.emergencyContact || "+91 80 0000 0000",
            type: "Registered Medical Facility",
            accreditation: user.hospitalDetails.licenseNo || "Verified Partner",
          };
          return [newHosp, ...prev];
        }
        return prev;
      });
    }
  }, [user]);

  // Haversine formula to compute distance in km
  const computeDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // Radius of Earth in KM
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  // Hospitals enriched with active requests, blood group breakdown, and calculated distance
  const hospitalsWithStats = useMemo(() => {
    return hospitals.map((hosp) => {
      const hospRequests = requests.filter(
        (r) =>
          (r.hospitalId === hosp.id || r.hospitalName.toLowerCase() === hosp.name.toLowerCase()) &&
          r.status !== "Completed" &&
          r.status !== "Cancelled"
      );

      // Group by blood type
      const bloodTypeMap = {};
      let totalUnitsNeeded = 0;
      let hasCritical = false;

      hospRequests.forEach((req) => {
        totalUnitsNeeded += Number(req.unitsNeeded || 1);
        if (req.urgency === "Critical") hasCritical = true;
        if (!bloodTypeMap[req.bloodGroup]) {
          bloodTypeMap[req.bloodGroup] = {
            group: req.bloodGroup,
            units: 0,
            urgency: req.urgency,
            requestsCount: 0,
          };
        }
        bloodTypeMap[req.bloodGroup].units += Number(req.unitsNeeded || 1);
        bloodTypeMap[req.bloodGroup].requestsCount += 1;
        if (req.urgency === "Critical") {
          bloodTypeMap[req.bloodGroup].urgency = "Critical";
        }
      });

      const distance = computeDistanceKm(userLocation.lat, userLocation.lng, hosp.lat, hosp.lng);

      return {
        ...hosp,
        requests: hospRequests,
        requestsCount: hospRequests.length,
        totalUnitsNeeded,
        hasCritical,
        bloodTypesNeeded: Object.values(bloodTypeMap),
        distance,
      };
    });
  }, [hospitals, requests, userLocation]);

  // Post blood request (by hospital or emergency)
  const addHospitalRequest = async (requestData) => {
    const newReq = {
      ...requestData,
      id: "req-" + Date.now(),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await api.post("/blood/requests", requestData);
      if (res.data?._id) {
        newReq.id = res.data._id;
      }
    } catch (err) {
      console.warn("Saved request to local cache:", err.message);
    }

    setRequests((prev) => [newReq, ...prev]);
    return newReq;
  };

  // Delete a request
  const deleteRequest = async (id) => {
    try {
      await api.delete(`/blood/requests/${id}`);
    } catch (err) {
      console.warn("Deleted locally:", err.message);
    }
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  // Update status (Pending, Accepted, Completed, Cancelled)
  const updateRequestStatus = async (id, status) => {
    try {
      await api.patch(`/blood/requests/${id}/status`, { status });
    } catch (err) {
      console.warn("Updated status locally:", err.message);
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  // Add voluntary donor
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

  return (
    <BloodDonationContext.Provider
      value={{
        hospitals,
        hospitalsWithStats,
        requests,
        donors,
        userLocation,
        setUserLocation,
        computeDistanceKm,
        addHospitalRequest,
        deleteRequest,
        updateRequestStatus,
        addDonor,
      }}
    >
      {children}
    </BloodDonationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBloodDonation = () => useContext(BloodDonationContext);
