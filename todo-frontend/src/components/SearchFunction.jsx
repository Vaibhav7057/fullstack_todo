const SearchFunction = (func, time) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(args);
    }, time);
  };
};

export default SearchFunction;
