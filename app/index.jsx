import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function Index() {
  // Select the user from Redux
  const currentUser = useSelector((state) => state.user.currentUser);

  // LOGIC:
  // If user exists, go to the Home screen inside the (tabs) group.
  // If user is null, go to the SignIn screen inside the (auth) group.
  
  if (currentUser) {
    return <Redirect href="/(tabs)/Home" />;
  } else {
    return <Redirect href="/(auth)/SignIn" />;
  }
}