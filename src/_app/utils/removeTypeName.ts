export const removeTypeNameFromPayload = (input: any) => {
  if (Array.isArray(input)) {
    return input.map((item) => {
      if (item?.__typename) {
        delete item["__typename"];
      }
      return item;
    });
  } else {
    delete input?.__typename;
    return input;
  }
};
