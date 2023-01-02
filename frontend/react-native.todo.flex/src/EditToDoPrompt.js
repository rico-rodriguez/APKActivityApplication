import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';

Icon.loadFont(); // load FontFamily font

export function EditToDoPrompt(props) {
  const {onSubmit} = props;
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  //Select box
  const [openSelect, setOpenSelect] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([
    {label: 'Bath', value: 'Bath'},
    {label: 'Meal', value: 'Meal'},
    {label: 'Medicine', value: 'Medicine'},
    {label: 'Play', value: 'Play'},
    {label: 'Treat', value: 'Treat'},
    {label: 'Walk', value: 'Walk'},
  ]);
  const currentDate = `${date.toLocaleDateString()}`;
  const currentTime = `${time
    .toLocaleTimeString()
    .split(':')
    .slice(0, 2)
    .join(':')}`;
  return (
    <View style={styles.modalWrapper}>
      <Text h4 style={styles.addItemTitle}>
        Add a new activity
      </Text>
      <DropDownPicker
        placeholder={props.activity_type}
        open={openSelect}
        value={value}
        items={items}
        setOpen={setOpenSelect}
        setValue={setValue}
        setItems={setItems}
      />
      <Button type="clear" title={currentDate} onPress={() => setOpen(true)} />
      <DatePicker
        modal
        mode="date"
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <Button
        type="clear"
        title={currentTime}
        onPress={() => setOpenTime(true)}
      />
      <DatePicker
        modal
        open={openTime}
        mode="time"
        date={time}
        onConfirm={time => {
          setOpenTime(false);
          setTime(time);
        }}
        onCancel={() => {
          setOpenTime(false);
        }}
      />
      <Button
        title="Save"
        buttonStyle={styles.saveButton}
        onPress={() => onSubmit({activity_type: value, date, time})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    width: 300,
    minHeight: 400,
    borderRadius: 4,
    alignItems: 'center',
  },
  addItemTitle: {
    margin: 20,
  },
  saveButton: {
    width: 280,
  },
});
