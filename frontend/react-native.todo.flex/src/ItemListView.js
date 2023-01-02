import React, {useEffect, useState, useMemo} from 'react';
import {BSON} from 'realm';
import {useUser} from '@realm/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Overlay, ListItem} from 'react-native-elements';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {CreateToDoPrompt} from './CreateToDoPrompt';
import RealmContext from './RealmContext';
import {EditToDoPrompt} from './EditToDoPrompt';
const {useRealm, useQuery} = RealmContext;

Icon.loadFont(); // load FontAwesome font

export function ItemListView() {
  const realm = useRealm();
  const items = useQuery('Item');
  const user = useUser();
  const [showNewItemOverlay, setShowNewItemOverlay] = useState(false);
  const [showEditItemOverlay, setShowEditItemOverlay] = useState(false);

  useEffect(() => {
    // initialize the subscriptions
    const updateSubscriptions = async () => {
      await realm.subscriptions.update(mutableSubs => {
        // subscribe to all of the logged in user's to-do items
        let ownItems = realm
          .objects('Item')
          .filtered(`owner_id == "${user.id}"`);
        // use the same name as the initial subscription to update it
        mutableSubs.add(ownItems, {name: 'ownItems'});
      });
    };
    updateSubscriptions();
  }, [realm, user]);

  // createItem() takes in a activity and then creates an Item object with that activity
  const createItem = ({activity_type, date, time}) => {
    // if the realm exists, create an Item
    if (realm) {
      realm.write(() => {
        realm.create('Item', {
          _id: new BSON.ObjectID(),
          owner_id: user.id,
          activity_type: activity_type,
          date,
          time,
        });
      });
    }
  };
  const updateItem = (_id, updatedActivityType, updatedDate, updatedTime) => {
    // if the realm exists, get the Item with a particular _id and update its activity_type, date, and time fields
    if (realm) {
      const item = realm.objectForPrimaryKey('Item', _id._id); // search for a realm object with a primary key that is an objectId
      realm.write(() => {
        item.activity_type = _id.updatedActivityType;
        item.date = _id.updatedDate;
        item.time = _id.updatedTime;
      });
    }
  };

  // deleteItem() deletes an Item with a particular _id
  const deleteItem = _id => {
    // if the realm exists, get the Item with a particular _id and delete it
    if (realm) {
      const item = realm.objectForPrimaryKey('Item', _id); // search for a realm object with a primary key that is an objectId
      realm.write(() => {
        realm.delete(item);
      });
    }
  };
  function getIconNameForActivityType(activityType) {
    switch (activityType) {
      case 'Medicine':
        return 'heart-plus';
      case 'Meal':
        return 'food-drumstick';
      case 'Treat':
        return 'candy';
      // Add more cases as needed
      case 'Bath':
        return 'shower';
      case 'Walk':
        return 'walk';
      case 'Play':
        return 'dog-side';
      default:
        return 'Circle';
    }
  }
  return (
    <SafeAreaProvider>
      <View style={styles.viewWrapper}>
        <Button
          title="+ ADD ACTIVITY"
          buttonStyle={styles.addToDoButton}
          onPress={() => setShowNewItemOverlay(true)}
        />
        <Overlay
          isVisible={showNewItemOverlay}
          onBackdropPress={() => setShowNewItemOverlay(false)}>
          <CreateToDoPrompt
            onSubmit={({activity_type, date, time}) => {
              setShowNewItemOverlay(false);
              createItem({
                activity_type: activity_type,
                date: date,
                time: time,
              });
            }}
          />
        </Overlay>
        {items.map(item => (
          <ListItem key={`${item._id}`} bottomDivider topDivider>
            <Icon
              name={getIconNameForActivityType(item.activity_type)}
              size={24}
              color="#000"
            />
            <ListItem.Title style={styles.itemTitle}>
              {item.activity_type} -
              {item.date.toDateString().split(' ').slice(1).join(' ')} -
              {item.time.toLocaleTimeString().split(':').slice(0, 2).join(':')}
            </ListItem.Title>

            <Overlay
              isVisible={showEditItemOverlay}
              onBackdropPress={() => setShowEditItemOverlay(false)}>
              <EditToDoPrompt
                activity_type={item.activity_type}
                item={item}
                onSubmit={({activity_type, date, time}) => {
                  setShowEditItemOverlay(false);
                  updateItem({
                    _id: item._id,
                    updatedActivityType: activity_type,
                    updatedDate: date,
                    updatedTime: time,
                  });
                }}
              />
            </Overlay>
            <Button
              type="clear"
              icon={{name: 'edit'}}
              onPress={() => setShowEditItemOverlay(true)}
            />
            <Button
              type="clear"
              onPress={() => deleteItem(item._id)}
              icon={{
                name: 'remove-circle',
                size: 15,
                color: 'red',
              }}
            />
          </ListItem>
        ))}
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your activities are synced with your ID
        </Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    margin: 40,
  },
  addToDoButton: {
    backgroundColor: '#00BAD4',
    borderRadius: 4,
    margin: 5,
  },
  itemTitle: {
    flex: 1,
  },
});
