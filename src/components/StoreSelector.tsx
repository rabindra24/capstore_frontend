import { Store } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface StoreData {
    _id: string;
    name: string;
    platform: string;
    status: string;
}

interface StoreSelectorProps {
    stores: StoreData[];
    selectedStore: string | null;
    onStoreChange: (storeId: string) => void;
    showAllOption?: boolean;
}

export function StoreSelector({ stores, selectedStore, onStoreChange, showAllOption = true }: StoreSelectorProps) {
    return (
        <Select value={selectedStore || "all"} onValueChange={onStoreChange}>
            <SelectTrigger className="w-[200px]">
                <Store className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
                {showAllOption && (
                    <SelectItem value="all">All Stores</SelectItem>
                )}
                {stores.map((store) => (
                    <SelectItem key={store._id} value={store._id}>
                        <div className="flex items-center gap-2">
                            <span>{store.name}</span>
                            <span className="text-xs text-muted-foreground">
                                ({store.platform})
                            </span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
