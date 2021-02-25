import React from 'react';
import { Text, View, Image } from 'react-native';

import { TextField, Button } from '../index';

import Card from './index';

export default { title: 'junipero-native/Card' };

const styles = {
  title: { fontSize: 22, lineHeight: 38, marginBottom: 20 },
  text: { fontSize: 16, lineHeight: 32 },
  icon: { marginBottom: 50, height: 50, width: 50 },
  form: { flex: 1, flexDirection: 'column' },
  formItem: { marginTop: 30 },
};

const CardBody = () => (
  <React.Fragment>
    <Text style={styles.title}>Card Title</Text>
    <Text style={styles.text}>This is a basic card. You can use it to display
    any type of text, picture and/or icon. It is supposed to have 30px/40px
    paddings and regular paragraph texts.</Text>
  </React.Fragment>
);

const CardBodyWithIcon = () => (
  <React.Fragment>
    <Image source={{ uri: 'https://cutt.ly/6k12q0g' }} style={styles.icon}/>
    <Text style={styles.title}>Card Title</Text>
    <Text style={styles.text}>This is a basic card. You can use it to display
    any type of text, picture and/or icon. It is supposed to have 30px/40px
    paddings and regular paragraph texts.</Text>
  </React.Fragment>
);

const Form = () => (
  <React.Fragment>
    <Text style={styles.title}>Card Title</Text>
    <Text style={styles.text}>This form centralises everything you need to
    configure your app the easiest way possible. It has beautiful text fields,
    some hand crafted card header & footer, and a nice box shadow that will
    melt your 2001 ATI graphics card.</Text>
    <View style={styles.form}>
      <TextField
        customStyle={{ wrapper: styles.formItem }}
        label="Label"
        value="Thomas Bangalter"
      />
      <TextField
        customStyle={{ wrapper: styles.formItem }}
        label="Label"
        textContentType="password"
        value="securePassword"
      />
      <Button
        customStyle={{ button: styles.formItem }}
        theme="primary">
        Update
      </Button>
    </View>
  </React.Fragment>
);

export const basic = () => (
  <Card><CardBody /></Card>
);

export const withIcon = () => (
  <Card><CardBodyWithIcon /></Card>
);

export const withForm = () => (
  <Card><Form /></Card>
);
