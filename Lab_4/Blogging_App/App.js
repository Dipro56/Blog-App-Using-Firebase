import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./src/screens/HomeScreen";
import NotificationScreen from "./src/screens/NotificationScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SignInScreen from "./src/screens/SignInScreen";
import PostScreen from "./src/screens/PostScreen";
import { AuthContext, AuthProvider } from "./src/providers/AuthProvider";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyB3lVtQcP2RIRLxMvaEGaJDVO17Jiz1dQI",
  authDomain: "bloggingapp-79f72.firebaseapp.com",
  projectId: "bloggingapp-79f72",
  storageBucket: "bloggingapp-79f72.appspot.com",
  messagingSenderId: "112269309499",
  appId: "1:112269309499:web:3169f228df096abb120e1e",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


const AuthStack = createStackNavigator();
const HomeTab = createMaterialBottomTabNavigator();
const AppDrawer = createDrawerNavigator();
const PostStack = createStackNavigator();

const AppDrawerScreen = () => {
  return (
    <AppDrawer.Navigator>
      <AppDrawer.Screen name="Home" component={HomeTabScreen} />
      <AppDrawer.Screen name="Profile" component={ProfileScreen} />
    </AppDrawer.Navigator>
  );
};

const PostStackScreen = () => {
  return (
    <PostStack.Navigator initialRouteName="HomeScreen">
      <PostStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <PostStack.Screen
        name="PostScreen"
        component={PostScreen}
        options={{ headerShown: false }}
      />
    </PostStack.Navigator>
  );
};

const HomeTabScreen = () => {
  return (
    <HomeTab.Navigator initialRouteName="Home">
      <HomeTab.Screen
        name="Home"
        component={PostStackScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" color="white" size={26} />
            ) : (
              <AntDesign name="home" color="white" size={22} />
            ),
        }}
      />
      <HomeTab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="ios-notifications" size={26} color="white" />
            ) : (
              <Ionicons
                name="ios-notifications-outline"
                size={22}
                color="white"
              />
            ),
        }}
      />
    </HomeTab.Navigator>
  );
};

const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator initialRouteName="SignIn">
      <AuthStack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};


function App() {
  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {(auth) => (
          <NavigationContainer>
            {auth.IsLoggedIn ? <AppDrawerScreen /> : <AuthStackScreen />}
          </NavigationContainer>
        )}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}

export default App;
