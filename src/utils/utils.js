import swal from "sweetalert";

export function success() {
  return swal({
    icon: "success",
    title: " ",
    buttons: false,
    timer: 1200,
  });
}

export function error() {
  return swal({
    icon: "error",
    title: " ",
    buttons: false,
    timer: 1200,
  });
}

export function countDays(start, end) {
  let start_date = start ? new Date(start) : new Date(),
    end_date = new Date(end),
    difference = end_date.getTime() - start_date.getTime(),
    days = Math.ceil(difference / (1000 * 3600 * 24));
  return days;
}

export function ssa(array, sort_key, search_key, search) {
  return array
    .sort((x, y) => {
      let a = x[sort_key];
      let b = y[sort_key];
      return a > b ? 1 : a == b ? 0 : -1;
    })
    .filter((item) => {
      return String(item[search_key])
        .toLowerCase()
        .match(String(search).toLowerCase());
    });
}

export function countOrdinalNumber(index, page, limit) {
  let start = null,
    numbers = [];
  start = (page - 1) * limit;
  for (let i = 0; i < limit; i++) {
    numbers.push(start);
    start++;
  }
  return numbers[index] + 1;
}
