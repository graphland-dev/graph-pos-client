import { Combobox } from "@headlessui/react";
import { clsx } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import React, { Fragment, useEffect } from "react";

interface Prop {
  data: any[];
  onChange: (text: string) => void;
  onSelect: (item: any) => void;
  labelKey: string;
  placeholder?: string;
  loading: boolean;
  enableNoResultDropdown?: boolean;
  NoResultComponent?: React.ReactNode;
}

const AutoComplete: React.FC<Prop> = ({
  data,
  placeholder,
  labelKey,
  onChange,
  onSelect,
  loading,
  NoResultComponent,
}) => {
  const [searchTerm, setSearchTerm] = useDebouncedState("", 100);

  useEffect(() => {
    onChange(searchTerm);
  }, [onChange, searchTerm]);

  return (
    <Combobox onChange={onSelect}>
      <div className="relative w-full">
        <div className="relative">
          <Combobox.Input
            placeholder={placeholder}
            onChange={(event) => setSearchTerm(event.target.value)}
            className={"border border-slate-300 px-2 py-3 rounded-md w-full"}
          />
          {loading && (
            <svg
              className="absolute right-0 w-5 h-5 mr-3 -ml-1 text-blue-400 top-3 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
        </div>
        <Combobox.Options
          className={
            "absolute top-10 left-0 w-full shadow-lg z-50 rounded-md bg-slate-100"
          }
        >
          {data?.map((item: any, idx: number) => (
            <Combobox.Option key={idx} value={item} as={Fragment}>
              {({ active }) => (
                <li className={clsx("px-2 py-1", { "bg-blue-200": active })}>
                  {item[labelKey]}
                </li>
              )}
            </Combobox.Option>
          ))}

          {!data.length && !loading && (
            <Combobox.Option value={searchTerm} as={Fragment}>
              {({ active }) => (
                <li className={clsx("px-2 py-1", { "bg-blue-200": active })}>
                  {NoResultComponent}
                </li>
              )}
            </Combobox.Option>
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default AutoComplete;
