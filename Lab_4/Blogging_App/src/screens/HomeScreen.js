import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Card } from "react-native-elements";
import { AuthContext } from "../providers/AuthProvider";
import PostCardComponent from "./../components/PostCardComponent";
import HeaderComponent from "./../components/HeaderComponent";
import StoreDataComponent from "../components/StoreDataComponent";
import { AsyncStorage } from "react-native";
import {
  getDataJSON,
  storeDataJSON,
} from "./../functions/AsyncStorageFunctions";
import { Button } from "react-native-elements";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import * as firebase from "firebase";
import "firebase/firestore";

const HomeScreen = (props) => {
  const [posts, setPosts] = useState([]);
  const [postID, setpostID] = useState(0);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const [count, setCount] = useState(0);
  const [icon, setIcon] = useState(["like2"]);

 

  const loadPosts = async () => {
    setLoading(true);
    firebase
      .firestore()
      .collection("posts")
      .orderBy("created_at", "desc")
      .onSnapshot((querySnapshot) => {
        let temp_posts = [];
        querySnapshot.forEach((doc) => {
          temp_posts.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setPosts(temp_posts);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert(error);
      });
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <AuthContext.Consumer>
      {(auth) => (
        <View style={styles.viewStyle}>
          <HeaderComponent
            DrawerFunction={() => {
              props.navigation.toggleDrawer();
            }}
          />
          <Card>
            <StoreDataComponent
              Text="What's On Your Mind ?"
              currentFunc={setInput}
              currentText={input}
              pressFunction={function () {
                setLoading(true);
                firebase
                  .firestore()
                  .collection("posts")
                  .add({
                    userId: auth.CurrentUser.uid,
                    body: input,
                    author: auth.CurrentUser.displayName,
                    created_at: firebase.firestore.Timestamp.now(),
                    likes: [],
                    comments: [],
                  })
                  .then((docRef) => {
                    setLoading(false);
                    //alert("post created successfully!");
                    alert("Post id "+docRef.id);
                  })
                  .catch((error) => {
                    setLoading(false);
                    alert(error);
                  });
              }}
            />
          </Card>
          <FlatList
            data={posts}
            onRefresh={loadPosts}
            refreshing={loading}
            renderItem={function ({ item }) {
              return (
                <View>
                  <Card>
                    <PostCardComponent
                      author={item.data.author}
                      body={item.data.body}
                    />
                    <Card.Divider />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        type="outline"
                        title={`Like (${count})`}
                        icon={
                          <AntDesign name={icon} size={24} color="dodgerblue" />
                        }
                        onPress={async function () {
                          if (icon == "like2") {
                            firebase
                              .firestore()
                              .collection("posts")
                              .doc(item.id)
                              .update({
                                likes: firebase.firestore.FieldValue.arrayUnion(
                                  {
                                    liker: auth.CurrentUser.uid,
                                  }
                                ),
                              })
                              .then(() => {
                                setCount(count + 1);
                                setIcon("like1");
                              })
                              .catch((error) => {
                                alert(error);
                              });
                          } else {
                            setCount(count - 1);
                            setIcon("like2");
                            firebase
                              .firestore()
                              .collection("posts")
                              .doc(item.id)
                              .update({
                                likes: firebase.firestore.FieldValue.arrayUnion(
                                  {
                                    liker: auth.CurrentUser.uid,
                                  }
                                ),
                              });
                          }
                        }}
                      />

                     
                      <Button
                        type="outline"
                        icon={
                          <FontAwesome
                            name="comment"
                            size={24}
                            color="dodgerblue"
                          />
                        }
                        title=" Comment"
                        onPress={() => {
                          props.navigation.navigate("PostScreen", {
                            postId: item.id,
                            author: item.data.author,
                            body: item.data.body,
                          });
                        }}
                      />
                    </View>
                  </Card>
                </View>
              );
            }}
          />
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
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});

export default HomeScreen;
