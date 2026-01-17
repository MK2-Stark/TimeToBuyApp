import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Platform,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
];

export default function App() {
  const [itemPrice, setItemPrice] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isNeed, setIsNeed] = useState(null);
  const [result, setResult] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const resultRef = useRef(null);

  // Load saved settings
  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings when they change
  useEffect(() => {
    saveSettings();
  }, [hourlyRate, taxRate, currency]);

  const loadSettings = async () => {
    try {
      const savedRate = await AsyncStorage.getItem('hourlyRate');
      const savedTax = await AsyncStorage.getItem('taxRate');
      const savedCurrency = await AsyncStorage.getItem('currency');

      if (savedRate) setHourlyRate(savedRate);
      if (savedTax) setTaxRate(savedTax);
      if (savedCurrency) setCurrency(savedCurrency);
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      if (hourlyRate) await AsyncStorage.setItem('hourlyRate', hourlyRate);
      if (taxRate) await AsyncStorage.setItem('taxRate', taxRate);
      if (currency) await AsyncStorage.setItem('currency', currency);
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const formatTime = (totalHours) => {
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

    return timeStr;
  };

  const calculateTime = () => {
    const price = parseFloat(itemPrice);
    const rate = parseFloat(hourlyRate);
    const tax = parseFloat(taxRate) || 0;

    if (isNaN(price) || isNaN(rate) || rate <= 0) {
      setResult({ error: 'Please enter valid numbers.' });
      return;
    }

    if (tax < 0 || tax > 100) {
      setResult({ error: 'Tax rate must be between 0 and 100.' });
      return;
    }

    // Pre-tax calculation
    const preTaxHours = price / rate;

    // After-tax calculation
    const effectiveRate = rate * (1 - tax / 100);
    const afterTaxHours = price / effectiveRate;

    setResult({
      preTax: formatTime(preTaxHours),
      preTaxHours: preTaxHours.toFixed(1),
      afterTax: formatTime(afterTaxHours),
      afterTaxHours: afterTaxHours.toFixed(1),
      price: price,
      isNeed: isNeed,
    });

    // Reset Need/Want selection after calculation
    setIsNeed(null);

    // Animate result appearance
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Scroll to results section after a brief delay
    setTimeout(() => {
      resultRef.current?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
        },
        () => { }
      );
    }, 300);
  };

  const getCurrencySymbol = () => {
    return CURRENCIES.find(c => c.code === currency)?.symbol || '$';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('./assets/timetobuy logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Make Mindful Spending Decisions</Text>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          {/* Currency Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Currency</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={currency}
                onValueChange={(value) => setCurrency(value)}
                style={styles.picker}
              >
                {CURRENCIES.map((curr) => (
                  <Picker.Item
                    key={curr.code}
                    label={`${curr.symbol} ${curr.code}`}
                    value={curr.code}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Item Price Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Item Price</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>{getCurrencySymbol()}</Text>
              <TextInput
                style={styles.input}
                value={itemPrice}
                onChangeText={setItemPrice}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#A0A8C1"
              />
            </View>
          </View>

          {/* Hourly Rate Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Hourly Rate (before tax)</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>{getCurrencySymbol()}</Text>
              <TextInput
                style={styles.input}
                value={hourlyRate}
                onChangeText={setHourlyRate}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#A0A8C1"
              />
            </View>
          </View>

          {/* Tax Rate Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tax Rate (%)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { paddingLeft: 16 }]}
                value={taxRate}
                onChangeText={setTaxRate}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor="#A0A8C1"
              />
              <Text style={styles.percentSymbol}>%</Text>
            </View>
            <Text style={styles.helpText}>
              Your actual tax rate on earned income
            </Text>
          </View>

          {/* Need vs Want */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Is this a need or a want?</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  isNeed === true && styles.toggleButtonActive,
                ]}
                onPress={() => setIsNeed(true)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    isNeed === true && styles.toggleTextActive,
                  ]}
                >
                  Need
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  isNeed === false && styles.toggleButtonActive,
                ]}
                onPress={() => setIsNeed(false)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    isNeed === false && styles.toggleTextActive,
                  ]}
                >
                  Want
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Calculate Button */}
          <TouchableOpacity
            style={[
              styles.calculateButton,
              (!itemPrice || !hourlyRate || isNeed === null) && styles.calculateButtonDisabled,
            ]}
            onPress={calculateTime}
            activeOpacity={0.8}
            disabled={!itemPrice || !hourlyRate || isNeed === null}
          >
            <Text style={[
              styles.calculateButtonText,
              (!itemPrice || !hourlyRate || isNeed === null) && styles.calculateButtonTextDisabled,
            ]}>
              Calculate
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {result && !result.error && (
          <View ref={resultRef} collapsable={false}>
            <Animated.View
              style={[
                styles.resultCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.resultTitle}>Time Investment Required</Text>

              {/* Pre-tax result */}
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>Pre-Tax</Text>
                <Text style={styles.resultTime}>{result.preTax}</Text>
                <Text style={styles.resultHours}>
                  ({result.preTaxHours} hours of your life)
                </Text>
              </View>

              {/* After-tax result */}
              {taxRate && parseFloat(taxRate) > 0 && (
                <View style={styles.resultSection}>
                  <Text style={styles.resultLabel}>After-Tax</Text>
                  <Text style={styles.resultTime}>{result.afterTax}</Text>
                  <Text style={styles.resultHours}>
                    ({result.afterTaxHours} hours of your life)
                  </Text>
                </View>
              )}

              {/* Mindful spending message */}
              <View style={styles.reflectionBox}>
                {result.isNeed === true && (
                  <Text style={styles.reflectionText}>
                    ✓ This represents <Text style={styles.bold}>{result.afterTaxHours || result.preTaxHours} hours of your life</Text>.
                    You've identified it as a <Text style={styles.bold}>need</Text>—are you certain it's essential and worth this time?
                  </Text>
                )}
                {result.isNeed === false && (
                  <Text style={styles.reflectionText}>
                    ⚠️ This is a <Text style={styles.bold}>want</Text>. Is it worth{' '}
                    {result.afterTaxHours || result.preTaxHours} hours of your life?
                  </Text>
                )}
                {result.isNeed === null && (
                  <Text style={styles.reflectionText}>
                    💭 Take a moment to reflect: Is this purchase worth the time
                    you'll spend earning it?
                  </Text>
                )}
              </View>
            </Animated.View>
          </View>
        )}

        {/* Error Message */}
        {result && result.error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{result.error}</Text>
          </View>
        )}

        {/* Footer Message */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerIcon}>⏳</Text>
          <Text style={styles.footer}>
            <Text style={styles.footerBold}>Remember:</Text> Every purchase is a trade of your{' '}
            <Text style={styles.footerHighlight}>time</Text> for an{' '}
            <Text style={styles.footerHighlight}>item</Text>.{' '}
            <Text style={styles.footerBold}>Choose wisely.</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  logo: {
    width: 240,
    height: 160,
    alignSelf: 'center',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7388',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#EEF0FF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#6B73FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1F36',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8EBF5',
    paddingHorizontal: 16,
    height: 54,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B73FF',
    marginRight: 8,
  },
  percentSymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B73FF',
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#1A1F36',
    padding: 0,
  },
  helpText: {
    fontSize: 13,
    color: '#8892A6',
    marginTop: 6,
    fontStyle: 'italic',
  },
  pickerContainer: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8EBF5',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      // Additional fix for web to ensure border follows radius
      WebkitAppearance: 'none',
      MozAppearance: 'none',
    }),
  },
  picker: {
    height: 54,
    color: '#1A1F36',
    borderRadius: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8EBF5',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  toggleButtonActive: {
    borderColor: '#6B73FF',
    backgroundColor: '#6B73FF',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7388',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  calculateButton: {
    backgroundColor: '#6B73FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#6B73FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  calculateButtonDisabled: {
    backgroundColor: '#D1D5E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  calculateButtonTextDisabled: {
    color: '#8892A6',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    shadowColor: '#9B4DCA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1F36',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultSection: {
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7388',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultTime: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B73FF',
    marginTop: 8,
  },
  resultHours: {
    fontSize: 14,
    color: '#8892A6',
    marginTop: 4,
    fontStyle: 'italic',
  },
  reflectionBox: {
    backgroundColor: '#FFF9F0',
    borderLeftWidth: 4,
    borderLeftColor: '#FFB84D',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  reflectionText: {
    fontSize: 15,
    color: '#1A1F36',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
  },
  errorCard: {
    backgroundColor: '#FFE8E8',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4D4D',
  },
  errorText: {
    fontSize: 15,
    color: '#C41E3A',
    fontWeight: '600',
  },
  footerContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFBF5',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6B73FF',
    shadowColor: '#6B73FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  footer: {
    fontSize: 15,
    color: '#1A1F36',
    lineHeight: 22,
    flex: 1,
  },
  footerBold: {
    fontWeight: '700',
    color: '#6B73FF',
  },
  footerHighlight: {
    fontWeight: '700',
    color: '#1A1F36',
    fontStyle: 'italic',
  },
});
