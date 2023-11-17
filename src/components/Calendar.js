import React from "react";
import { Calendar } from "antd";
import { Dayjs } from "dayjs";

const CalendarComponent = () => {
  const disabledDate = (current = Dayjs) => {
    const today = Dayjs();
    return current < today.startOf('day');
  };

  const monthCellRender = (value = Dayjs) => {
    // Your existing logic for month cell render
  };

  return (
    <>
      <Calendar
        className="w-1/1 p-3"
        fullscreen={false}
        monthCellRender={monthCellRender}
        disabledDate={disabledDate}
      />
    </>
  );
};

export default CalendarComponent;
