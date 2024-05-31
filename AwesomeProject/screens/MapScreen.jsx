import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";

import * as Location from "expo-location";

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setLocation(coords);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.arrowLeft}>
        <TouchableOpacity
          style={styles.input}
          onPress={() => navigation.navigate("CreatePostsScreen")}
        >
          <Text style={[styles.inputText, { paddingLeft: 25 }]}>
            My location
          </Text>
          <Feather name="arrow-left" size="24" style={styles.locationIcon} />
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.mapStyle}
        region={{
          ...location,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {location && (
          <Marker title="I am here" coordinate={location} description="Hello" />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    display: "flex",
    // alignItems: "center",
  },
  mapStyle: {
    width: "100%",
    height: "80%",
  },
  arrowLeft: {},

  input: {
    width: 343,
    paddingBottom: 16,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(232, 232, 232, 1)",
  },
  inputText: {
    paddingTop: 11,
    margin: "auto",
    size: 17,
    color: "rgba(33, 33, 33, 1)",
    fontWeight: 500,
    fontFamily: "Roboto-Medium",
    lineHeight: 22,
    letterSpacing: -0.22,
  },
  locationIcon: {
    width: 24,
    position: "absolute",
    bottom: 15,
    color: "rgba(189, 189, 189, 1)",
    // paddingRight: 16,
  },
});
