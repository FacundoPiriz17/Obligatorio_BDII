import { Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";

export function AppModal({ visible, onClose, title, children }) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
                <Animated.View
                    entering={SlideInDown.duration(200)}
                    exiting={SlideOutDown.duration(160)}
                >
                    <Pressable
                        className="rounded-t-3xl bg-white px-5 pb-10 pt-5"
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View className="mb-4 flex-row items-center justify-between">
                            {title && <Text className="text-lg font-bold text-ink">{title}</Text>}
                            <Pressable onPress={onClose} hitSlop={8} className="ml-auto">
                                <Ionicons name="close" size={22} color="#747781" />
                            </Pressable>
                        </View>
                        {children}
                    </Pressable>
                </Animated.View>
            </Pressable>
        </Modal>
    );
}
