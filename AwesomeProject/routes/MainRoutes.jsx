import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { ButtonNavigationIcon } from "../componets/ButtonNavIcon";
import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import PostsScreen from "../screens/PostsScreen";
import CommentsScreen from "../screens/CommentsScreen";
import TabRoutes from "./TabRoutes";
import MapScreen from "../screens/MapScreen";
import useAuth from "../hooks/useAuth";

const Stack = createNativeStackNavigator();

const MainRoutes = () => {
  const { user } = useAuth();
  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Home"
            component={TabRoutes}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Comment" component={CommentsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LogIn"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="LogIn" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default MainRoutes;
