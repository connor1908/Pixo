import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(dateString: string): string {
  const inputDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - inputDate.getTime();

  const msInMinute = 60 * 1000;
  const msInHour = 60 * msInMinute;
  const msInDay = 24 * msInHour;
  const msInWeek = 7 * msInDay;
  const msInMonth = 30.44 * msInDay; // Average month
  const msInYear = 365.25 * msInDay;

  const pluralize = (value: number, unit: string) =>
    `${value} ${unit}${value === 1 ? "" : "s"} ago`;

  switch (true) {
    case diffInMs < msInMinute:
      return "just now";
    case diffInMs < msInHour: {
      const minutes = Math.floor(diffInMs / msInMinute);
      return pluralize(minutes, "minute");
    }
    case diffInMs < msInDay: {
      const hours = Math.floor(diffInMs / msInHour);
      return pluralize(hours, "hour");
    }
    case diffInMs < msInWeek: {
      const days = Math.floor(diffInMs / msInDay);
      return pluralize(days, "day");
    }
    case diffInMs < msInMonth: {
      const weeks = Math.floor(diffInMs / msInWeek);
      return pluralize(weeks, "week");
    }
    case diffInMs < msInYear: {
      const months = Math.floor(diffInMs / msInMonth);
      return pluralize(months, "month");
    }
    default: {
      const day = inputDate.getDate().toString().padStart(2, "0");
      const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
      const year = inputDate.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }
}

//to check if a user liked a post
export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};
