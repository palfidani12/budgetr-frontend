import { useUser } from "../../hooks/user";
import { useUserSummary } from "../../hooks/user-summary";
import { Header } from "../header/Header";
import { Navigation } from "../navigation/Navigation";
import { Insights } from "./insights/Insights";
import { MoneyPockets } from "./money-pockets/MoneyPockets";
import { Summary } from "./summary/Summary";
import { TimeFrameSelector } from "./time-frame-selector/TimeFrameSelector";
import { Transactions } from "./transactions/Transactions";
import classes from "./Dashboard.module.scss";

export const Dashboard = () => {
  const user = useUser();
  // Example tip
  const tip = "Tip: Track your expenses daily to stay on top of your budget!";

  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  const nowIso = now.toISOString();
  const oneWeekAgoIso = oneWeekAgo.toISOString();
  const summaries = useUserSummary(oneWeekAgoIso, nowIso);
  const hufSummary = summaries?.find((summary) => summary.currency === "huf");

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
            {hufSummary && (
              <Summary
                totalBalance={0}
                totalExpenses={hufSummary.spending}
                totalIncome={hufSummary.income}
              />
            )}
          </div>
          <Insights />
        </div>
        {user?.moneyPockets && (
          <MoneyPockets moneyPockets={user?.moneyPockets} />
        )}
      </div>
      <h2>Transactions</h2>
      <Transactions />
    </div>
  );
};
