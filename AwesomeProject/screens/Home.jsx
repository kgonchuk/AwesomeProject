import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RegistrationScreen from "./RegistrationScreen";
import LoginScreen from "./LoginScreen";

const Tab = createBottomTabNavigator();

// const Home = () => {
//   return (
//     <View>
//       <Text>Home</Text>
//       <Tab.Navigator>
//         <Tab.Screen name="Registration" component={RegistrationScreen} />
//         <Tab.Screen name="LogIn" component={LoginScreen} />
//       </Tab.Navigator>
//     </View>
//   );
// };

// export default Home;
