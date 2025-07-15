import { useAuth } from "../../hooks/auth";
import { Header } from "../header/Header";
import { Navigation } from "../navigation/Navigation";
import { useUser } from "../../hooks/user";
import { TimeFrameSelector } from "./time-frame-selector/TimeFrameSelector";
import { MoneyPockets } from "./money-pockets/MoneyPockets";
import classes from "./Dashboard.module.scss";
import { Summary } from "./summary/Summary";

export const Dashboard = () => {
  const { userId } = useAuth();
  const user = useUser(userId);
  console.log("user", user);

  return (
    <div>
      <Header />
      <Navigation />
      <div className={classes.dashboardContentContainer}>
        <div className={classes.summarySection}>
          <div className={classes.summaryHeader}>
            <h2 className={classes.summaryTitle}>Summary</h2>
            <div className={classes.summaryTimeFrame}>
              <label className={classes.timeFrameLabel}>
                Time Frame:
              </label>
              <TimeFrameSelector
                onSelect={(value) => {
                  console.log("onselect called with", value);
                }}
              />
            </div>
          </div>
          <Summary totalBalance={0} totalExpenses={0} totalIncome={0} />
        </div>
        {user?.moneyPockets && (
          <MoneyPockets moneyPockets={user?.moneyPockets} />
        )}
      </div>
    </div>
  );
};
