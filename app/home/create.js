import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import axios from "axios";
import { useRouter } from "expo-router";

const create = () => {
  const [selectedColor, setSelectedColor] = useState("");
  const [title, setTitle] = useState("");
  const router = useRouter();
 
 //set out colours when recording movement
  const colors = [
    "#FF5733",
    "#FFD700",
    "#5D76A9",
    "#1877F2", 
    "#32CD32",
    "#CCCCFF",
    "#4169E1",
  ];


//set out days when recording datas
  const days = [ "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun" ];
  
  //the addHabit function is where a user adds the movement/kick
  async function addHabit() {
    try {
      const habitDetails = {
        title: title,
        color: selectedColor,
        repeatMode: "daily",
        reminder: true,
      };

      const response = await axios.post(
        "http://localhost:3000/habits",
        habitDetails
      );

      if (response.status === 200) {
        setTitle("");
        Alert.alert("Kick added successfully", "Enjoy!");
      }

      console.log("habit added", response);
    } catch (error) {
      console.log("error adding a habit", error);
    }
  }
  return (
    <View style={{ padding: 10 }}>
      <Ionicons onPress={() => router.push("/home/")} name="arrow-back" size={24} color="black" />

      <Text style={{ fontSize: 20, marginTop: 10 }}>
        Create <Text style={{ fontSize: 20, fontWeight: "500" }}>a Movement</Text>
      </Text>
      <TextInput
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={{
          width: "95%",
          marginTop: 15,
          padding: 15,
          borderRadius: 10,
          backgroundColor: "#E1EBEE",
        }}
        placeholder="Title"
      />

      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "500" }}>Movement Colour</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 10,
          }}
        >
          {colors?.map((item, index) => (
            <TouchableOpacity
              onPress={() => setSelectedColor(item)}
              key={index}
              activeOpacity={0.8}
            >
              {selectedColor === item ? (
                <AntDesign name="plussquare" size={30} color={item} />
              ) : (
                <FontAwesome name="square" size={30} color={item} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={{ fontSize: 18, fontWeight: "500" }}>Repeat</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginVertical: 10,
        }}
      >
        <Pressable
          style={{
            backgroundColor: "#AFDBF5",
            padding: 10,
            borderRadius: 6,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center" }}>Daily</Text>
        </Pressable>
      </View>

      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: "500" }}>Reminder</Text>
        <Text style={{ fontSize: 17, fontWeight: "500", color: "#2774AE" }}>
          Yes
        </Text>
      </View>

      <Pressable
       onPress={addHabit}
        style={{
          marginTop: 25,
          backgroundColor: "#00428c",
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Text
          style={{ textAlign: "center", color: "white", fontWeight: "bold" }}
        >
          SAVE
        </Text>
      </Pressable>
    </View>
  );
};

export default create;

const styles = StyleSheet.create({});