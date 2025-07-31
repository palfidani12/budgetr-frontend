import classes from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }: LoadingSpinnerProps) => (
  <div className={classes.loadingContainer}>
    <div className={`${classes.spinner} ${classes[size]}`} />
    {message && <p className={classes.message}>{message}</p>}
  </div>
);
