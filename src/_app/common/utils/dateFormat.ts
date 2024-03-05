import dayjs from "dayjs";

const dateFormat = (date: string) => {
  return dayjs(date).format("dddd, MMMM D, YYYY h:mm A");
};

export default dateFormat;
