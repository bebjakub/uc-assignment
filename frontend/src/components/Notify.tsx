import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNotification } from '../state/notification';

export default function Notify() {
  const [notification, setNotification] = useNotification();

  return (
    <Snackbar
      open={notification?.message?.length > 0}
      autoHideDuration={6000}
      onClose={() => {
        setNotification({
          ...notification,
          message: '',
        });
      }}
    >
      <Alert severity={notification?.type}>
        <div dangerouslySetInnerHTML={{ __html: notification?.message }} />
      </Alert>
    </Snackbar>
  );
}
