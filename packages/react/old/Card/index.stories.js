import Card from './index';
import Button from '../Button';
import TextField from '../TextField';

export default { title: 'junipero/Card' };

const styles = {
  title: { fontSize: '22px', lineHeight: '38px', marginBottom: '20px' },
  text: { fontSize: '16px', lineHeight: '32px' },
  icon: { marginBottom: '50px', height: '50px', width: '50px' },
  form: { display: 'flex', flexDirection: 'column' },
  formItem: { marginTop: '30px' },
};

const Form = () => (
  <>
    <div style={styles.title}>Card title</div>
    <div style={styles.text}>This form centralises everything you need to
    configure your app the easiest way possible. It has beautiful text fields,
    some hand crafted card header & footer, and a nice box shadow that will
    melt your 2001 ATI graphics card.
    </div>
    <div style={styles.form}>
      <div style={styles.formItem}>
        <TextField label="Label" value="Thomas Bangalter" />
      </div>
      <div style={styles.formItem}>
        <TextField label="Label" type="password" value="securePassword" />
      </div>
      <div style={styles.formItem}>
        <Button className="primary">Update</Button>
      </div>
    </div>
  </>
);

const CardBody = () => (
  <>
    <div style={styles.title}>Card title</div>
    <div style={styles.text}>This is a basic card. You can use it to display
    any type of text, picture and/or icon. It is supposed to have 30px/40px
    paddings and regular paragraph texts.
    </div>
  </>
);

const CardBodyWithIcon = () => (
  <>
    <img style={styles.icon} src="https://cutt.ly/6k12q0g" />
    <div style={styles.title}>Card title</div>
    <div style={styles.text}>This is a basic card. You can use it to display
    any type of text, picture and/or icon. It is supposed to have 30px/40px
    paddings and regular paragraph texts.
    </div>
  </>
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
