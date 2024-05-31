import { useEffect, useState } from "react";
import * as Location from "expo-location";

export const useLocation = () => {
  const [coordsLoading, setCoordsLoading] = useState(false);
  const [coordsError, setCoordsError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Permission to access location was denied");
        }
      } catch (error) {
        setCoordsError(error);
        throw error;
      }
    })();
  }, []);

  const getLocationFromAddress = async (address) => {
    try {
      setCoordsLoading(true);

      const location = await Location.geocodeAsync(address);
      if (location.length > 0) {
        const { latitude, longitude } = location[0];
        return { latitude, longitude };
      } else {
        return null;
      }
    } catch (error) {
      setCoordsError(error);
      throw error;
    } finally {
      setCoordsLoading(false);
    }
  };

  return {
    getLocationFromAddress,
    coordsLoading,
    coordsError,
  };
};
