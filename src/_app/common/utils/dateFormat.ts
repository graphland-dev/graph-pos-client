import dayjs from "dayjs";

const dateFormat = (date: string) => {
  return dayjs(date).format("MMMM D, YYYY h:mm A");
};

export default dateFormat;
