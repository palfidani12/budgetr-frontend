import { useAuth } from "../../hooks/auth";
import { Header } from "../header/Header";
import { Navigation } from "../navigation/Navigation";

export const Dashboard = () => {
  const { userId } = useAuth();
  return (
    <div>
      <Header />
      <Navigation />
      <p>Welcome user: {userId} </p>
    </div>
  );
};
