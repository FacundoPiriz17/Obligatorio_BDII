import { Text, View } from "react-native";
import { AppModal } from "../ui/AppModal";
import { AppButton } from "../ui/AppButton";

export function ConfirmDialog({
                                  visible,
                                  title,
                                  message,
                                  confirmLabel = "Confirmar",
                                  cancelLabel = "Cancelar",
                                  destructive = false,
                                  variant,
                                  loading = false,
                                  onConfirm,
                                  onCancel,
                              }) {
    const confirmVariant = variant ?? (destructive ? "danger" : "primary");

    return (
        <AppModal visible={visible} onClose={onCancel} title={title}>
            <Text className="mb-5 text-sm text-ink-soft">{message}</Text>
            <View className="gap-2">
                <AppButton variant={confirmVariant} loading={loading} onPress={onConfirm}>
                    {confirmLabel}
                </AppButton>
                <AppButton variant="ghost" disabled={loading} onPress={onCancel}>
                    {cancelLabel}
                </AppButton>
            </View>
        </AppModal>
    );
}