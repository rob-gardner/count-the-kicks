import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native'
import React, { useEffect, useState, useCallback }from 'react'
import { useRouter } from "expo-router";
import { Ionicons, Feather, EvilIcons, FontAwesome } from '@expo/vector-icons';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import { BottomModal, ModalTitle, SlideAnimation, ModalContent  } from 'react-native-modals';
import { useFocusEffect } from "@react-navigation/native";

const index = () => {
    const [option, setOption] = useState("Today");
    const router = useRouter();
    const [habits,setHabits] = useState([]);
    const [isModalVisible,setModalVisible] = useState(false);
    const [selectedHabit,setSelectedHabit] = useState();
    
    //set the date
    const currentDay = new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .slice(0,3);
    console.log(currentDay);
    useEffect(() => {
        fetchHabits();
    },[]);

    useFocusEffect(
      useCallback(() => {
        fetchHabits();
      }, [])
    );

    //synchronising the movements from the list
    const fetchHabits = async () => {
        try{
            const response = await axios.get("http://localhost:3000/habitslist");
            setHabits(response.data)

        } catch(error){
            console.log("Error fetching kicks",error);
        }
    }
    const handleLongPress = (habitId) => {
      const selectedHabit = habits?.find((habit) => habit._id == habitId);
      setSelectedHabit(selectedHabit);
      setModalVisible(true);
    }

    //handling the completion of a movement
    const handleCompletion = async () => {
      try {
        const habitId = selectedHabit?._id;
        const updatedCompletion = {
          ...selectedHabit?.completed,
          [currentDay]: true,
        };
  
        await axios.put(`http://localhost:3000/habits/${habitId}/completed`, {
          completed: updatedCompletion,
        });
  
        await fetchHabits();
  
        setModalVisible(false);
      } catch (error) {
        console.log("error", error);
      }
    };

    //filtering the habits
    const filteredHabits = habits?.filter((habit) => {
      return !habit.completed || !habit.completed[currentDay]
    });

    console.log("filtered kicks", habits);
    const days = ["Kick 1","Kick 2","Kick 3","Kick 4","Kick 5","Kick 6","Kick 7"];

    //deleting the movement
    const deleteHabit = async () =>{
      try{
        const habitId = selectedHabit._id;

        const response = await axios.delete(`http://localhost:3000/habits/${habitId}`)

        if(response.status == 200){
          setHabits(response.data)
        }

      } catch(error){
        console.log("error", error)
      }
    }

    //adding the days the movements where completed on
    const getCompletedDays = (completedObj) => {
      if(completedObj && typeof completedObj === "object"){
          return Object.keys(completedObj).filter((day) => completedObj[day]);
      }

      return [];
  }


    return (
      <>

        <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <MaterialIcons name="pregnant-woman" size={50} color="black" />
                <AntDesign onPress={() => router.push("/home/create")} name="pluscircle" size={24} color="black" />

            </View>
            <Text style={{ marginTop: 5, fontSize: 23, fontWeight: "500" }}>Count The Kicks!</Text>

            <View style={{flexDirection:"row",alignItems:"center",gap:10,marginVertical:8}}>
                <Pressable 
                onPress={() => setOption("Today")}
                    style={{ 
                        backgroundColor: option == "Today" ? "#E0FFFF" : "transparent", 
                        paddingHorizontal: 10, 
                        paddingVertical: 8, 
                        borderRadius: 25 
                    }}
                >
                    <Text style={{textAlign:"center",color:"gray",fontSize:14}}>Today</Text>
                </Pressable>
                <Pressable 
                onPress={() => setOption("Weekly")}
                    style={{ 
                        backgroundColor: option == "Weekly" ? "#E0FFFF" : "transparent",  
                        paddingHorizontal: 10, 
                        paddingVertical: 8, 
                        borderRadius: 25 
                    }}
                >
                    <Text style={{textAlign:"center",color:"gray",fontSize:14}}>Weekly</Text>
                </Pressable>
                <Pressable 
                onPress={() => setOption("Overall")}
                    style={{ 
                        backgroundColor: option == "Overall" ? "#E0FFFF" : "transparent",  
                        paddingHorizontal: 10, 
                        paddingVertical: 8, 
                        borderRadius: 25 
                    }}
                >
                    <Text style={{textAlign:"center",color:"gray",fontSize:14}}>Overall</Text>
                </Pressable>
            </View>

            {option == "Today" &&
          (filteredHabits?.length > 0 ? (
            <View>
              {filteredHabits?.map((item, index) => (
                <Pressable
                  onLongPress={() => handleLongPress(item._id)}
                  style={{
                    marginVertical: 10,
                    backgroundColor: item?.color,
                    padding: 12,
                    borderRadius: 24,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "500",
                      color: "white",
                    }}
                  >
                    {item?.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View
              style={{
                marginTop: 150,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "auto",
              }}
            >
              <Image
                style={{ width: 60, height: 60, resizeMode: "cover" }}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/10609/10609386.png",
                }}
              />

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "600",
                  marginTop: 10,
                }}
              >
                No movements currently tracked
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "600", //STOPPED AT 1:04:03
                  marginTop: 10,
                }}
              >
                Create a movement?
              </Text>

              <Pressable
                onPress={() => router.push("/home/create")}
                style={{
                  backgroundColor: "#0071c5",
                  marginTop: 20,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Text>Create</Text>
              </Pressable>
            </View>
          ))}

          {option == "Weekly" && (
            <View>
              {habits?.map((habit,index) => (
                <Pressable style={{marginVertical:10,backgroundColor:habit.color,padding:15,borderRadius:24}}>
                  <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                    <Text style={{fontSize:15, fontWeight:"500", color:"white"}}>
                      {habit.title}

                    </Text>
                    <Text style={{color:"white"}}>
                      {habit.repeatMode}
                    </Text>
                  </View>

                  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly",marginVertical:10}}>
                    {days?.map((day,item) => {
                      const isCompleted = habit.completed && habit.completed[day];

                      // return (
                      //   <Pressable>
                      //     <Text style={{color:day === currentDay ? "red" : "white"}}>
                      //       {day}
                      //     </Text>
                      //     {isCompleted ? (
                      //       <FontAwesome name="circle" size={24} color="white" style={{marginTop:12}} />
                      //     ) : (
                      //       <Feather name="circle" size={24} color="white" style={{marginTop:12}} />
                      //     )}
                      //   </Pressable>
                      // )
                    })}
                  </View>
                </Pressable>
              ))}

            </View>
          )}

{option === "Overall" && (
          <View>
            {habits?.map((habit, index) => (
              <>
                <Pressable
                  style={{
                    marginVertical: 10,
                    backgroundColor: habit.color,
                    padding: 15,
                    borderRadius: 24,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                        color: "white",
                      }}
                    >
                      {habit.title}
                    </Text>
                    <Text style={{ color: "white" }}>{habit.repeatMode}</Text>
                  </View>

                
                </Pressable>

                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                    <Text>Day</Text>
                    <Text>{getCompletedDays(habit.completed).join(", ")}</Text>
                </View>
              </>
            ))}
          </View>
        )}
        </ScrollView>

        <BottomModal 
        onBackdropPress={() => setModalVisible(!isModalVisible)}
        onHardwareBackPress={() => setModalVisible(!isModalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalTitle={<ModalTitle title="Choose Option" />}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        visible={isModalVisible}
        onTouchOutside={() => setModalVisible(!isModalVisible)}
        >
          <ModalContent style={{width:"100%", height:280}}>
            <View style={{marginVertical:10}}>
              <Text>Options</Text>
              <Pressable
                onPress={handleCompletion}
                style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginTop: 10,
                }}
              >
              <Ionicons name="checkmark-circle-outline" size={24} color="black" />
                <Text>Save Movement</Text>
              </Pressable>
              {/* <Pressable style={{flexDirection:"row",alignItems:"center", gap:12, marginTop:10}}>
                <Feather name="skip-forward" size={24} color="black" /> 
                <Text>Skip</Text>
              </Pressable> */}
              <Pressable style={{flexDirection:"row",alignItems:"center", gap:12, marginTop:10}}>
                <Feather name="edit-2" size={24} color="black" /> 
                <Text>Edit</Text>
              </Pressable>
              <Pressable style={{flexDirection:"row",alignItems:"center", gap:12, marginTop:10}}>
                <EvilIcons name="archive" size={24} color="black" /> 
                <Text>Archive</Text>
              </Pressable>
              <Pressable
                onPress={deleteHabit}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 12,
                }}
              >
                <AntDesign name="delete" size={24} color="black" /> 
                <Text>Delete</Text>
              </Pressable>
            </View>

          </ModalContent>

        </BottomModal>
        </>
    )
}

export default index

const styles = StyleSheet.create({})