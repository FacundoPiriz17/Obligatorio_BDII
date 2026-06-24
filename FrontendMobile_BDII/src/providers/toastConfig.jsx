import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BaseToast = ({ text1, icon, containerClass, textClass }) => (
    <View
        className={`mx-4 flex-row items-center gap-3 rounded-2xl px-4 py-3 ${containerClass}`}
        style={{ shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 }}
    >
        <Ionicons name={icon} size={20} color="currentColor" className={textClass} />
        <Text className={`flex-1 text-sm font-semibold ${textClass}`} numberOfLines={2}>
            {text1}
        </Text>
    </View>
);

export const toastConfig = {
    success: ({ text1 }) => (
        <BaseToast
            text1={text1}
            icon="checkmark-circle"
            containerClass="bg-ok-100 border border-ok-500"
            textClass="text-ok-600"
        />
    ),
    error: ({ text1 }) => (
        <BaseToast
            text1={text1}
            icon="alert-circle"
            containerClass="bg-danger-100 border border-danger-600"
            textClass="text-danger-700"
        />
    ),
    info: ({ text1 }) => (
        <BaseToast
            text1={text1}
            icon="information-circle"
            containerClass="bg-info-100 border border-info-500"
            textClass="text-info-600"
        />
    ),
};
