import React, { useState, useEffect } from "react";
import { View, StyleSheet, AsyncStorage, Image } from "react-native";
import { Text, Card, Button, Avatar } from "react-native-elements";
import { AuthContext } from "../providers/AuthProvider";
import HeaderHome from "../components/HeaderComponent";
import { removeData } from "../functions/AsyncStorageFunctions";
import * as firebase from "firebase";
import "firebase/firestore";

const ProfileScreen = (props) => {
  //console.log(props);
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const loadProfile = async () => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((querySnapshot) => {
        //console.log(querySnapshot.data().bod);
        //console.log("kisu ashe");
        setDob(querySnapshot.data().bod);
        setEmail(querySnapshot.data().email);
        setAddress(querySnapshot.data().address);
      })
      .then(() => {
        //setDob(bod);
        //alert("done");
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

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
         
            <View>
              <Text style={styles.textStyle}>
                ID: {firebase.auth().currentUser.uid}
              </Text>
              <Text style={styles.textStyle}>
                Name: {firebase.auth().currentUser.displayName}
              </Text>
              <Text style={styles.textStyle}>Date of Birth: {dob}</Text>
              <Text style={styles.textStyle}>Email: {email}</Text>
              <Text style={styles.textStyle}>Address: {address}</Text>
              <Button
                title=" Delete Account"
                type="solid"
                onPress={async function () {
                  firebase
                    .firestore()
                    .collection("posts")
                    .where("userId", "in", [firebase.auth().currentUser.uid])
                    .get()
                    .then((querySnapshot) => {
                      querySnapshot.forEach((doc) => {
                        doc.ref.delete();
                      });
                    });

                  firebase
                    .firestore()
                    .collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .delete();

                  firebase.auth().currentUser.delete();
                  alert("User deleted!");

                  auth.setIsLoggedIn(false);
                  auth.setCurrentUser({});
                }}
              />
            </View>
          </Card>
        </View>
      )}
    </AuthContext.Consumer>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 15,
    color: "black",
    alignSelf: "center",
  },
  viewStyle: {
    flex: 1,
  },
  imageStyle: {
    height: 200,
    width: 200,
    alignSelf: "center",
  },
});

export default ProfileScreen;
