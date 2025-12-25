import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type DateRangePickerProps = {
    value?: DateRange;
    onChange?: (range: DateRange | undefined) => void;
    className?: string;
};

export function DateRangePicker({
    value,
    onChange,
    className,
}: DateRangePickerProps) {
    const [date, setDate] = React.useState<DateRange | undefined>(value);
    const [preset, setPreset] = React.useState<string>("30days");

    const handlePresetChange = (value: string) => {
        setPreset(value);
        const today = new Date();
        let from: Date;
        let to: Date = today;

        switch (value) {
            case "today":
                from = today;
                break;
            case "7days":
                from = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "30days":
                from = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "90days":
                from = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case "custom":
                return;
            default:
                from = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        const newRange = { from, to };
        setDate(newRange);
        onChange?.(newRange);
    };

    const handleDateChange = (range: DateRange | undefined) => {
        setDate(range);
        setPreset("custom");
        onChange?.(range);
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 border-b">
                        <Select value={preset} onValueChange={handlePresetChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select preset" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="7days">Last 7 days</SelectItem>
                                <SelectItem value="30days">Last 30 days</SelectItem>
                                <SelectItem value="90days">Last 90 days</SelectItem>
                                <SelectItem value="custom">Custom range</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
