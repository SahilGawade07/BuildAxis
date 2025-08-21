import AsyncStorage from "@react-native-async-storage/async-storage";

export const isPromoter = async (): Promise<boolean> => {
  try {
    const userInfoStr = await AsyncStorage.getItem("userInfo");
    if (!userInfoStr) return false;

    const userInfo = JSON.parse(userInfoStr);

    // check role
    return userInfo.role?.toLowerCase() === "promoter";
  } catch (error) {
    console.error("Error checking promoter status:", error);
    return false;
  }
};
