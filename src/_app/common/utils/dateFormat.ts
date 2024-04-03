import dayjs from "dayjs";

const dateFormat = (date: string) => {
  if (date) return dayjs(date).format("dddd, MMMM D, YYYY h:mm A");
  return "(No Date)";
};

export default dateFormat;
