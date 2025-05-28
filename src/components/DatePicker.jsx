// src/components/DatePicker.jsx

import * as React from "react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ onSelect }) {
  const [date, setDate] = React.useState();

  const handleDateSelect = (newDate) => {
    setDate(newDate);
    if (onSelect) {
      onSelect(newDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-transparent border-0 text-lg py-6 text-white placeholder:text-gray-400",
            !date && "text-gray-400"
          )}
        >
          <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
          {date ? (
            format(date, "PPP", { locale: ro })
          ) : (
            <span>Alege data de plecare</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white/90 backdrop-blur-md">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          locale={ro}
          className="bg-transparent"
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </PopoverContent>
    </Popover>
  );
}