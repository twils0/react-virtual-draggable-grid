// prevent unwanted 'ghost' drag effect in browser
const preventDrag = (event) => {
  event.preventDefault();
  return false;
};

export default preventDrag;
