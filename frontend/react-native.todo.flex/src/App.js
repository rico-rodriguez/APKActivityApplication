import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {createStackNavigator} from '@react-navigation/stack';
import {AppProvider, UserProvider, useUser} from '@realm/react';

import {appId, baseUrl} from '../realm';
import {LogoutButton} from './LogoutButton';
import {WelcomeView} from './WelcomeView';
import {ItemListView} from './ItemListView';
import RealmContext from './RealmContext';
const {RealmProvider} = RealmContext;

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppWrapper = () => {
  return (
    <AppProvider id={appId} baseUrl={baseUrl}>
      <UserProvider fallback={WelcomeView}>
        <App />
      </UserProvider>
    </AppProvider>
  );
};
function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: '#000',
      }}>
      <Tab.Screen
        name="Feed"
        component={ItemListView}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
          headerRight: () => {
            return <LogoutButton />;
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={ItemListView}
        options={{
          tabBarLabel: 'Updates',
          tabBarIcon: ({color, size}) => (
            <Icon name="bell" color={color} size={size} />
          ),
          headerRight: () => {
            return <LogoutButton />;
          },
          tabBarBadge: 1,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ItemListView}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon name="account" color={color} size={size} />
          ),
          headerRight: () => {
            return <LogoutButton />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
const App = () => {
  return (
    <>
      {/* After login, user will be automatically populated in realm configuration */}
      <RealmProvider
        sync={{
          flexible: true,
          initialSubscriptions: {
            update: (subs, realm) => {
              // subscribe to all of the logged in user's to-do items
              subs.add(realm.objects('Item'), {name: 'ownItems'});
            },
          },
        }}
        fallback={() => (
          <View style={styles.activityContainer}>
            <ActivityIndicator size="large" />
          </View>
        )}>
        <SafeAreaProvider>
          <NavigationContainer>
            <MyTabs />
          </NavigationContainer>
        </SafeAreaProvider>
      </RealmProvider>
    </>
  );
};

const styles = StyleSheet.create({
  footerText: {
    fontSize: 10,
    textAlign: 'center',
  },
  footer: {
    margin: 40,
  },
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default AppWrapper;
