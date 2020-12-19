import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Card } from "react-native-elements";
import PostCardComponent from "./../components/PostCardComponent";

import { AuthContext } from "../providers/AuthProvider";

import {
  getDataJSON,
  removeData,
  storeDataJSON,
} from "../functions/AsyncStorageFunctions";
import HeaderComponent from "./../components/HeaderComponent";
import StoreDataComponent from "../components/StoreDataComponent";
import { AsyncStorage } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";

//import React from "react";
import { Button, Input } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";
//import { View } from "react-native";

const PostScreen = (props) => {
  const postId = props.route.params.postId;
  //console.log(props);
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState([]);
  const [commentID, setCommentID] = useState(0);

  {
  

    const loadComments = async () => {
  
      firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .onSnapshot((querySnapshot) => {
          let temp_comments = [];
          querySnapshot.data().comments.forEach((doc) => {
            temp_comments.push(doc);
          });
          setComments(temp_comments);
          //alert(comments);
          setLoading(false);
        })
        .catch((error) => {
          alert(error);
          setLoading(false);
        });
    };

    useEffect(() => {
 
      loadComments();
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
              <Card.Title>The post</Card.Title>
              <PostCardComponent
                author={props.route.params.author}
                body={props.route.params.body}
              />
            </Card>
            <Card>
              <Input
                placeholder="Post a comment"
                leftIcon={<Entypo name="pencil" size={24} color="black" />}
                onChangeText={(currentText) => {
                  setComments(currentText);
                }}
              />
              <Button
                title="Post"
                type="outline"
                onPress={() => {
                  firebase
                    .firestore()
                    .collection("posts")
                    .doc(postId)
                    .update({
                      comments: firebase.firestore.FieldValue.arrayUnion({
                        commenter: auth.CurrentUser.uid,
                        comment: comments,
                      }),
                    })
                    .then(() => {
                      alert("comment done successfully!");
                    })
                    .catch((error) => alert(error));
                }}
              />

       
            </Card>

            <ScrollView>
              <Card>
                <Card.Title>Comments for this post</Card.Title>
                <FlatList
                  data={comments}s
                  renderItem={function ({ item }) {
                    return (
                      <View>
                        <Card>
                          <PostCardComponent
                            author={item.commenter}
                            body={item.comment}
    
                          />
                        </Card>
                      </View>
                    );
                  }}
                />
              </Card>
            </ScrollView>
          </View>
        )}
      </AuthContext.Consumer>
    );
  }
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 25,
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

export default PostScreen;
