import React from "react";

export enum MONTH {
    PREVIOUS,
    CURRENT,
    NEXT
}
type MonthContextProps = {
    month: MONTH;
    setMonth: (newMonth: MONTH) => void;
}
export const MonthContext = React.createContext<Partial<MonthContextProps>>({
    month: 1,
    setMonth: (newMonth: MONTH) => { }
});