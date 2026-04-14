import { Dimensions } from "react-native";

/**
 * BOTTOM_PADDING_OFFSET is used to add extra padding at the bottom of a child scroller.
 * This additional space helps to create a more pronounced bounce effect when the parent
 * scroll view bounces. It is set to the height of the device's window.
 */
export const BOTTOM_PADDING_OFFSET = Dimensions.get("window").height;
