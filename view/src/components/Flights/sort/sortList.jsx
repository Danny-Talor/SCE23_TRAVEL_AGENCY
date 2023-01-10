import { Form } from "react-bootstrap";
export default function SortList(props) {

  function compareValues(key, order = "asc") {
    return function innerSort(a, b) {
      let varA = typeof a[key] === "object" ? a[key].label.toUpperCase() : a[key];
      let varB = typeof b[key] === "object" ? b[key].label.toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  }
  function sorts(values) {
    let data = [...props.flightsList];
    if (values === "origin") {
      data = data.sort(compareValues("origin"));
    } else if (values === "destination") {
      data = data.sort(compareValues("destination"));
    } else if (values === "price_down") {
      data = data.sort(compareValues("price", "desc"));
    } else if (values === "price_up") {
      data = data.sort(compareValues("price"));
    } else if (values === "popularity") {
      data = data.sort(compareValues("popularity"));
    }
    props.setflightsList(data);
  }

  return (
    <div>
      <Form.Select onChange={(e) => sorts(e.target.value)}>
        <option value="origin">origin</option>
        <option value="destination">destination</option>
        <option value="price_down">price - decrease</option>
        <option value="price_up">price - increase</option>
        <option value="popularity">popularity</option>
      </Form.Select>

    </div>
  );
}
