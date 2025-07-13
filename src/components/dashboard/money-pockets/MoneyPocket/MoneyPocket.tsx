import type { Dispatch, SetStateAction } from "react";
import type { MoneyPocket as MoneyPocketType } from "../../../../types/money-pocket-type";
import classes from "./MoneyPocket.module.scss";

// Default icon for when no iconUrl is provided
const getDefaultIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'savings':
    case 'savings account':
      return '💰';
    case 'checking':
    case 'checking account':
      return '🏦';
    case 'credit card':
    case 'credit':
      return '💳';
    case 'investment':
    case 'investment account':
      return '📈';
    case 'crypto':
    case 'cryptocurrency':
      return '₿';
    case 'cash':
      return '💵';
    default:
      return '🏛️';
  }
};

// Format currency based on the currency code
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Get type display name
const getTypeDisplayName = (type: string) => {
  const typeMap: Record<string, string> = {
    'savings': 'Savings',
    'savings account': 'Savings',
    'checking': 'Checking',
    'checking account': 'Checking',
    'credit card': 'Credit Card',
    'credit': 'Credit Card',
    'investment': 'Investment',
    'investment account': 'Investment',
    'crypto': 'Crypto',
    'cryptocurrency': 'Crypto',
    'cash': 'Cash',
  };
  
  return typeMap[type.toLowerCase()] || type;
};

export const MoneyPocket = ({
  moneyPocket,
  setVisiblePocketNames,
}: {
  moneyPocket: MoneyPocketType;
  setVisiblePocketNames: Dispatch<SetStateAction<string[]>>;
}) => {
  const hidePocket = () => {
    setVisiblePocketNames((prev) =>
      prev.filter((pocket) => pocket != moneyPocket.name)
    );
  };

  const icon = moneyPocket.iconUrl || getDefaultIcon(moneyPocket.type);
  const formattedBalance = formatCurrency(moneyPocket.balance, moneyPocket.currency);
  const typeDisplayName = getTypeDisplayName(moneyPocket.type);

  return (
    <div className={classes.pocketCard}>
      <div className={classes.pocketHeader}>
        <div className={classes.pocketIcon}>
          {moneyPocket.iconUrl ? (
            <img 
              src={moneyPocket.iconUrl} 
              alt={`${moneyPocket.name} icon`}
              className={classes.iconImage}
            />
          ) : (
            <span className={classes.defaultIcon}>{icon}</span>
          )}
        </div>
        
        <div className={classes.pocketInfo}>
          <h3 className={classes.pocketName}>{moneyPocket.name}</h3>
          <span className={classes.pocketType}>{typeDisplayName}</span>
        </div>
        
        <button 
          onClick={hidePocket}
          className={classes.closeButton}
          aria-label="Close pocket"
        >
          ×
        </button>
      </div>
      
      <div className={classes.pocketBalance}>
        <span className={classes.balanceLabel}>Balance</span>
        <span className={classes.balanceAmount}>{formattedBalance}</span>
      </div>
    </div>
  );
};
