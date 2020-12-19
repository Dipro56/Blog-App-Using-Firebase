import React, { useState } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { Text, Card, Button, Avatar } from "react-native-elements";
import { AuthContext } from "../providers/AuthProvider";
import HeaderHome from "../components/HeaderComponent";
const NotificationScreen = (props) => {
  return (
    <AuthContext.Consumer>
      {(auth) => (
        <View style={styles.viewStyle}>
          <HeaderHome
            DrawerFunction={() => {
              props.navigation.toggleDrawer();
            }}
          />
          <Card>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Avatar
                containerStyle={{ backgroundColor: "blue" }}
                rounded
                icon={{
                  name: "thumbs-o-up",
                  type: "font-awesome",
                  color: "black",
                }}
                activeOpacity={1}
              />
              <Text style={{ paddingHorizontal: 10 }}>abc liked your post</Text>
            </View>
          </Card>


          <Card>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Avatar
                containerStyle={{ backgroundColor: "blue" }}
                rounded
                icon={{
                  name: "thumbs-o-up",
                  type: "font-awesome",
                  color: "black",
                }}
                activeOpacity={1}
              />
              <Text style={{ paddingHorizontal: 10 }}>
                John liked your post
              </Text>
            </View>
          </Card>
        </View>
      )}
    </AuthContext.Consumer>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30,
    color: "blue",
  },
  viewStyle: {
    flex: 1,
  },
});

export default NotificationScreen;
