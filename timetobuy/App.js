import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function App() {
  const [itemPrice, setItemPrice] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [result, setResult] = useState('');

  const calculateTime = () => {
    const price = parseFloat(itemPrice);
    const rate = parseFloat(hourlyRate);
    if (isNaN(price) || isNaN(rate) || rate <= 0) {
      setResult('Enter valid numbers.');
      return;
    }
    const totalHours = price / rate;
    const days = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;
    const hours = Math.floor(remainingHours);
    const minutes = Math.round((remainingHours % 1) * 60);
    
    let timeStr = '';
    if (days > 0) {
      timeStr += `${days} day${days > 1 ? 's' : ''}, `;
    }
    timeStr += `${hours} hour${hours !== 1 ? 's' : ''}`;
    if (minutes > 0) {
      timeStr += `, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    
    setResult(`Time to afford: ${timeStr}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time To Buy X</Text>
      
      <Text style = {styles.inputTitle}>Price:</Text>
      <TextInput
        style={styles.input}
        value={itemPrice}
        onChangeText={setItemPrice}
        keyboardType="numeric"
        placeholder="e.g., 100"
      />
      
      <Text style = {styles.inputTitle}>Hourly Rate:</Text>
      <TextInput
        style={styles.input}
        value={hourlyRate}
        onChangeText={setHourlyRate}
        keyboardType="numeric"
        placeholder="e.g., 15"
      />
      <View style={styles.calculateView}>
        <Button title="Calculate" onPress={calculateTime}/>
      </View>
      
      
      {result ? <Text style={styles.result}>{result}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20 
  },

  title: { 
    fontSize: 24,
    textAlign: 'center', 
    marginBottom: 20,
    top: -100,
  },

  inputTitle: { 
    fontSize: 16,
    marginBottom: 10,
    top: -100,
  },

  calculateView:{
    top: -100,
  },

  input: { 
    borderWidth: 1, 
    padding: 10,
    marginBottom: 10, 
    top: -100,
  },

  result: { 
    marginTop: 20, 
    fontSize: 16, 
    textAlign: 'center', 
    top: -100,
  },
});
