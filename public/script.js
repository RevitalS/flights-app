function showFlights(flight) {
  const postsFlights = flight.map(
    (fly) => `
            <li>
                <div>"${fly.id}"</div>
                <div>${fly.from}</div>
                <div>${fly.to}</div>
                <div>${fly.departure}</div>
                <div>${fly.arrival}</div>
                <div>${fly.by}</div>
            </li>
        `
  );
  output.innerHTML = postsFlights.join(" ");
}

const click = document.getElementById("filter");
click.addEventListener("click", sendFilter);
function sendFilter() {
  let filter1 = "";
  let filter2 = "";
  const filters = Array.from(document.querySelectorAll(".checkbox"));
  if (filters[0].checked == true) {
    const from = document.getElementById("fromText").value;
    filter1 += "from=" + from;
  }
  if (filters[1].checked == true) {
    const by = document.getElementById("byText").value;
    filter2 += "by=" + by;
  }

  fetch("flights.json?" + filter1 + "&" + filter2)
    .then((response) => response.json())
    .then((flight) => {
      console.log(flight);
      showFlights(flight);
    });
}
