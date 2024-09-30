import { StyleSheet, TouchableOpacity, DeviceEventEmitter } from 'react-native'; // Import DeviceEventEmitter
import { useState, useEffect } from 'react';
import { Text, View } from '@/components/Themed';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function TabTwoScreen() {
  const [selectedBody, setSelectedBody] = useState<string>('defaultFrame');

  // Load the saved body image from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSettings = async () => {
      const savedBody = await AsyncStorage.getItem('selectedBody');
      if (savedBody) {
        setSelectedBody(savedBody);
      }
    };

    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    await AsyncStorage.setItem('selectedBody', selectedBody); // Save the state to AsyncStorage

    // Emit an event when settings are saved
    DeviceEventEmitter.emit('bodyChanged', selectedBody);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Body image selection */}
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Choose your character</Text>
        <Picker
          selectedValue={selectedBody}
          style={styles.picker}
          onValueChange={(itemValue: string) => setSelectedBody(itemValue)}
        >
          <Picker.Item label="Fox" value="defaultFrame" />
          <Picker.Item label="Owl" value="customBody1" />
          <Picker.Item label="Bear" value="customBody2" />
          <Picker.Item label="Deer" value="customBody3" />
        </Picker>
      </View>

      <TouchableOpacity onPress={handleSaveSettings} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    backgroundColor: '#09011f',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#D69DF1',
    marginBottom: 20,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 10,
  },
  settingLabel: {
    fontSize: 20,
    color: '#EBCEF8',
  },
  picker: {
    height: 50,
    width: 150,
    color: '#EBCEF8',
  },
  saveButton: {
    marginTop: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#D69DF1',
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
