import { toast } from 'react-toastify';

const toastMessage = ({
  type = 'info',
  message,
}: {
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
}) => {
  toast[type](message);
};

export default toastMessage;
