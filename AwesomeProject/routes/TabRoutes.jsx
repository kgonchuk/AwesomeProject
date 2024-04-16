import { StyleSheet, View, TouchableOpacity } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../screens/ProfileScreen";
import PostsScreen from "../screens/PostsScreen";
import CreatePostsScreen from "../screens/CreatePostsScreen";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const TabRoutes = () => {
  const navigation = useNavigation();
  const onHandleBack = () => {
    navigation.navigate("PostsScreen");
  };
  const onHandleLogout = () => {
    navigation.navigate("LogIn");
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "PostsScreen") {
            iconName = "grid";
          }
          if (route.name === "CreatePostsScreen") {
            iconName = "plus";
          }
          if (route.name === "ProfileScreen") {
            iconName = "user";
          }
          return (
            <View style={focused && styles.iconActive}>
              <Feather name={iconName} size={24} color={focused && "white"} />
            </View>
          );
        },
        tabBarShowLabel: false,
        tabBarStyle: { height: 83 },
      })}
    >
      <Tab.Screen
        name="PostsScreen"
        component={PostsScreen}
        options={{
          title: "Posts",
          unmountOnBlur: true,
          headerRight: () => (
            <TouchableOpacity onPress={onHandleLogout}>
              <Feather
                name="log-out"
                size={24}
                style={{ paddingRight: 10, color: "rgba(189, 189, 189, 1)" }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="CreatePostsScreen"
        component={CreatePostsScreen}
        options={() => ({
          title: "Створити публікацію",
          unmountOnBlur: true,
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <TouchableOpacity onPress={onHandleBack}>
              <Feather
                name="arrow-left"
                size="24"
                style={{ paddingLeft: 16, color: "rgba(189, 189, 189, 1)" }}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  iconActive: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 108, 0, 1)",

    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TabRoutes;
