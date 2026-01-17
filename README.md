# TimeToBuyApp

**A mindful spending companion that helps you make thoughtful financial decisions by visualizing the time cost of purchases.**

![TimeToBuyApp](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-blue)
![Expo](https://img.shields.io/badge/Expo-~54.0.13-000020?logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81.4-61DAFB?logo=react)

---

## 📖 Philosophy

TimeToBuyApp is built on a simple yet powerful principle: **every purchase is a trade of your time for an item**. 

We spend hours of our lives working to earn money, yet we often make spending decisions impulsively without considering the time investment required. This app helps you:

- **Spend money mindfully** rather than impulsively
- **Distinguish needs from wants**
- **Understand the true cost** of purchases in terms of life hours worked
- **Make informed decisions** about whether items are worth your time

---

## ✨ Features

### 💰 Currency Support
- Choose from 10+ major currencies (USD, EUR, GBP, CAD, AUD, JPY, CNY, INR, CHF, SEK)
- Currency symbols automatically update throughout the app
- Settings are saved and persist across app restarts

### 📊 Tax Calculator
- Enter your actual tax rate on earned income
- See **two results**: Pre-tax and After-tax time calculations
- Understand the real cost after taxes are considered

### 🎯 Need vs Want Reflection
- Toggle between "Need" and "Want" for each purchase
- Receive contextual guidance based on your selection
- Encourages thoughtful consideration before buying

### 💾 Settings Persistence
- Your hourly rate, tax rate, and currency selection are automatically saved
- Settings load when you reopen the app using AsyncStorage
- No need to re-enter information each time

### ✨ Beautiful, Calming Design
- Soft blue/purple color scheme that encourages reflection
- Smooth animations when displaying results
- Clean, focused interface that respects the app's simple purpose
- Thoughtful typography for easy reading

### 📱 Cross-Platform
- Runs on iOS, Android, and Web
- Built with React Native and Expo for maximum compatibility

---

## 🎨 Screenshots

*Coming soon - will be added after first run*

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo Go app (for mobile testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/TimeToBuyApp.git
   cd TimeToBuyApp/timetobuy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

### Running on Different Platforms

#### iOS
```bash
npm run ios
```
*Requires macOS with Xcode installed*

#### Android
```bash
npm run android
```
*Requires Android Studio and an Android emulator or physical device*

#### Web
```bash
npm run web
```
*Opens in your default web browser*

#### Expo Go (Mobile)
1. Install the Expo Go app on your iOS or Android device
2. Run `npm start`
3. Scan the QR code with your device camera (iOS) or Expo Go app (Android)

---

## 🛠️ Technical Stack

| Technology | Purpose |
|-----------|---------|
| **React Native** | Cross-platform mobile framework |
| **Expo** | Development platform and build tool |
| **AsyncStorage** | Persistent local storage for settings |
| **React Native Picker** | Currency selection dropdown |
| **Animated API** | Smooth animations for UI transitions |

---

## 📘 How to Use

1. **Select your currency** from the dropdown (e.g., USD, EUR)
2. **Enter the item price** you're considering purchasing
3. **Enter your hourly rate** (your net income per hour after deductions)
4. **Enter your tax rate** (optional, for more accurate calculations)
5. **Choose "Need" or "Want"** to reflect on the nature of the purchase
6. **Tap "Calculate"** to see how many hours of your life this purchase costs

The app will show you:
- **Pre-tax time**: Based on your gross hourly rate
- **After-tax time**: Based on your net income after taxes
- **Reflection prompt**: Contextual guidance based on whether it's a need or want

---

## 🎯 Use Cases

- **Before making a purchase**: Calculate if that new gadget is worth working 20 hours for
- **Comparing options**: See which purchase offers better value for your time
- **Budget planning**: Understand your spending in terms of time investment
- **Teaching financial literacy**: Help others visualize the time-money connection
- **Impulse control**: Create a pause before spending to consider the true cost

---

## 🧮 Calculation Logic

```javascript
// Pre-tax calculation
hoursNeeded = itemPrice / hourlyRate

// After-tax calculation  
effectiveHourlyRate = hourlyRate × (1 - taxRate/100)
hoursNeededAfterTax = itemPrice / effectiveHourlyRate
```

Results are displayed in a human-readable format: days, hours, and minutes.

---

## 🔮 Future Roadmap

- [ ] Multiple currency conversion API integration
- [ ] Savings goal tracker
- [ ] Purchase history and analytics
- [ ] Share results on social media
- [ ] Widget for quick calculations
- [ ] Dark mode theme
- [ ] Customizable motivational quotes
- [ ] Export calculation reports

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 💡 Inspiration

> "The price of anything is the amount of life you exchange for it."  
> — Henry David Thoreau

This app was created to help people make more conscious spending decisions by visualizing the relationship between time, work, and money.

---

## 📧 Contact

For questions, suggestions, or feedback, please open an issue on GitHub.

---

**Remember: Every purchase is a trade of your time for an item. Choose wisely.** ⏳✨
