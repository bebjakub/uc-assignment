import { atom, useRecoilState } from 'recoil';
import { AlertColor } from '@mui/material/Alert';

interface Notification {
  type: AlertColor;
  message: string;
}

export const notificationState = atom({
  key: 'notification',
  default: {
    type: 'success',
    message: '',
  } as Notification,
});

export const useNotification = () => useRecoilState(notificationState);
