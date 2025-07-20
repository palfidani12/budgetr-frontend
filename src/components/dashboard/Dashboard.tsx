import { Header } from "../header/Header";
import { Navigation } from "../navigation/Navigation";
import { useUser } from "../../hooks/user";
import { TimeFrameSelector } from "./time-frame-selector/TimeFrameSelector";
import { MoneyPockets } from "./money-pockets/MoneyPockets";
import classes from "./Dashboard.module.scss";
import { Summary } from "./summary/Summary";
import { Insights } from "./insights/Insights";

export const Dashboard = () => {
  const user = useUser();
  // Example tip
  const tip = "Tip: Track your expenses daily to stay on top of your budget!";

  return (
    <div>
      <Header />
      <Navigation />
      <div className={classes.dashboardContentContainer}>
        <div className={classes.topRow}>
          <div className={classes.welcomeCard}>
            <div className={classes.welcomeMessage}>
              Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
            </div>
            <div className={classes.tipMessage}>{tip}</div>
          </div>
        </div>
        <div className={classes.cardsRow}>
          <div className={classes.summarySection}>
            <div className={classes.summaryHeader}>
              <h2 className={classes.summaryTitle}>Summary</h2>
              <div className={classes.summaryTimeFrame}>
                <TimeFrameSelector
                  onSelect={(value) => {
                    console.log("onselect called with", value);
                  }}
                />
              </div>
            </div>
            <Summary totalBalance={0} totalExpenses={0} totalIncome={0} />
          </div>
          <Insights />
        </div>
        {user?.moneyPockets && (
          <MoneyPockets moneyPockets={user?.moneyPockets} />
        )}
      </div>
    </div>
  );
};
