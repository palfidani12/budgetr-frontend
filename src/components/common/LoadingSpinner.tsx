import classes from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <div className={classes.loadingContainer}>
      <div className={`${classes.spinner} ${classes[size]}`}></div>
      {message && <p className={classes.message}>{message}</p>}
    </div>
  );
}; 