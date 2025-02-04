import { StyleSheet, SafeAreaView, ActivityIndicator, NativeModules,
  ScrollView, StatusBar, View, TextInput, Button, Text, LogBox
 } from 'react-native';
import React, {FC, useState, useEffect} from 'react';
// import EditScreenInfo from '@/components/EditScreenInfo';
// import { Text, View } from '@/components/Themed';

LogBox.ignoreAllLogs(true);
const API_KEY = 'Grt13LbnDJxDle5DrY8dFV88S6nFsgH5';
const BASE_URL = 'https://api.apilayer.com/exchangerates_data';
const {RNSharedWidget} = NativeModules;

export default function TabTwoScreen() {

  const [from, setFrom] = useState('EUR');
  const [to, setTo] = useState('USD');
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [focusItem, setFocusItem] = useState('');
  const [result, setResult] = useState('0');
  useEffect(() => {
    if (result === '0') {
      // getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);
  const getData = async () => {
    setLoading(true);
    try {
      let response;
      const request = await fetch(
        BASE_URL + `/convert?to=${to}&from=${from}&amount=${amount}`,
        {
          method: 'GET',
          headers: {
            apiKey: API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      if (request.status === 200) {
        response = await request.json();
      }
      if (response && response.result) {
        setResult((response.result as any).toFixed(2));
        setLoading(false);
        RNSharedWidget.setData(
          'convertorMonex',
          JSON.stringify({
            from,
            to,
            amount: Number(amount),
            result: response.result.toFixed(2),
          }),
          (_status: number | null) => {
            // log callback in case of success/error
          }
        );
      }
    } catch (e) {
      setLoading(false);
      setResult(`error:  ${JSON.stringify(e)}`);
    }
  };
  const onSubmit = () => {
    getData();
  };
  const getColor = (item: string) => {
    return focusItem === item
      ? {
          borderColor: 'green',
          borderWidth: 2,
        }
      : {};
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentContainerStyle={styles.container}>
        <View testID="input view section">
          <View testID="form" style={styles.fieldsContainer}>
            <TextInput
              placeholder="100"
              value={amount}
              onChangeText={txt => setAmount(txt)}
              style={[styles.input, getColor('amount')]}
              onFocus={() => setFocusItem('amount')}
              focusable={focusItem === 'amount'}
            />
            <TextInput
              onChangeText={txt => setFrom(txt)}
              value={from}
              placeholder="EUR"
              style={[styles.input, getColor('from')]}
              onFocus={() => setFocusItem('from')}
              focusable={focusItem === 'from'}
            />
            <TextInput
              value={to}
              onChangeText={txt => setTo(txt)}
              placeholder="USD"
              style={[styles.input, getColor('to')]}
              onFocus={() => setFocusItem('to')}
              focusable={focusItem === 'to'}
            />
            <Button title="Submit" onPress={onSubmit} disabled={loading} />
          </View>
        </View>
        <View testID="view selection section" style={styles.resultContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <Text style={styles.result}>{result}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.title}>Tab Two</Text>
  //     <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
  //     <EditScreenInfo path="app/(tabs)/two.tsx" />
  //   </View>
  // );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
// });

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  resultContainer: {
    padding: 30,
    height: 300,
    backgroundColor: '#996',
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldsContainer: {
    marginVertical: 30,
  },
  input: {
    padding: 10,
    borderRadius: 5,
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    borderColor: 'grey',
    borderWidth: 1,
  },
  result: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});