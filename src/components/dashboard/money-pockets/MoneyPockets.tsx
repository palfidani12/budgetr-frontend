import { useState } from "react";
import type { MoneyPocket as MoneyPocketType } from "../../../types/money-pocket-type";
import { MoneyPocket } from "./MoneyPocket/MoneyPocket";
import { DropdownSelector } from "../../dropdown-selector/DropdownSelector";
import classes from "./MoneyPockets.module.scss";

const defaultOptions = [
  "Add New Account",
  "Import from Bank",
  "Create Savings Goal",
  "Add Credit Card",
  "Add Investment Account",
  "Add Crypto Wallet",
];

export const MoneyPockets = ({
  moneyPockets,
}: {
  moneyPockets: MoneyPocketType[];
}) => {
  const defaultShownPockets = moneyPockets
    .slice(0, 2)
    .map((pocket) => pocket.name); // This is temporary, the goal is to save this preference and then show later what was saved
  const [visiblePocketNames, setVisiblePocketNames] =
    useState<string[]>(defaultShownPockets);
  const visiblePockets = moneyPockets.filter((pocket) =>
    visiblePocketNames.includes(pocket.name)
  );

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h2 className={classes.title}>Accounts</h2>
        <DropdownSelector
          options={[
            ...defaultOptions,
            ...moneyPockets.map((pocket) => pocket.name),
          ]}
          onSelect={(option) => {
            setVisiblePocketNames((prev) => [...prev, option]);
          }}
        />
      </div>

      <div className={classes.pocketsGrid}>
        {visiblePockets.map((pocket) => (
          <MoneyPocket
            key={pocket.id}
            moneyPocket={pocket}
            setVisiblePocketNames={setVisiblePocketNames}
          />
        ))}
      </div>
    </div>
  );
};
