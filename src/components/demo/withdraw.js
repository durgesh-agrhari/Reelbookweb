import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const Wihdraw = () => {
  return (
    <View>
      <Text
        style={{
          color: 'black',
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Wihdraw Your Payment
      </Text>

      <View style={styles.earnigbox}>
        <View>
          <Text
            style={{
              color: 'black',
              fontSize: 18,
              fontWeight: 'bold',
              opacity: 0.9,
            }}>
            Your Earning
          </Text>
          <Text style={{color: 'black', fontSize: 32, fontWeight: 'bold',opacity:0.8}}>
            $1475.
            <Text
              style={{
                color: 'black',
                fontSize: 22,
                fontWeight: 'bold',
                opacity: 0.7,
              }}>
              00
            </Text>
          </Text>
        </View>

        <View>
          <View style={{alignItems: 'center'}}>
            <Image
              source={{
                uri: 'https://www.bridgingpointsmedia.com/wp-content/uploads/1225501.png',
              }}
              style={{
                width: 80,
                height: 50,
                borderRadius: 5,
              }}
            />
          </View>
        </View>
      </View>

      <View>
        <View style={{marginHorizontal: 20}}>
          <Text
            style={{
              marginTop: 20,
              color: 'green',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Enter your any Upi id or mobile number for payment
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
            }}>
            <View>
              <Image
                source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR69IQd3wq6qBFaREO4AQwUlarjqvO_n_UJcQ&s',
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 20,
                  borderColor: 'white',
                  borderWidth: 2,
                }}
              />
            </View>
            <View>
              <Image
                source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4_83Ln9j056YauVhiI_5MBhFbajEXBioFbQ&s',
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 20,
                  borderColor: 'white',
                  borderWidth: 2,
                }}
              />
            </View>
            <View>
              <Image
                source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkWSW_uqFjj2am_im0rzgO8U5Dkvxis7JfG-bVhMrnqyqHS8bGb6pNhxF0v9NvPgKxKG8&usqp=CAU',
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 20,
                  borderColor: 'white',
                  borderWidth: 2,
                }}
              />
            </View>
          </View>
          <TextInput
            style={styles.upi}
            placeholder="Enter your UPI id or mobile number"
            placeholderTextColor="black"
          />

          <TextInput
            style={styles.amount}
            placeholder="$ Enter your Ammount"
            placeholderTextColor="black"
          />

          <View>
            <TouchableOpacity
              style={{backgroundColor: 'green', borderRadius: 10}}>
              <Text
                style={{
                  padding: 10,
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Clame your payment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Wihdraw;

const styles = StyleSheet.create({
  upi: {
    marginTop: 40,
    flexDirection: 'row',
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 2.5,
    marginBottom: 10,
  },
  amount: {
    marginTop: 10,
    flexDirection: 'row',
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 2.5,
    marginBottom: 20,
  },
  earnigbox: {
    margin: 20,
    backgroundColor: '#e1e3e1',
    padding: 5,
    paddingLeft: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity:0.8,
    borderColor:'gray',
    borderWidth:2,
  },
});

