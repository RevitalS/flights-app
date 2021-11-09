function showUsers(flight) {
  const postsFlights = flight.map(
    (fly) => `
            <li>
                <p>"${flight.id}"</p>
                <p>${flight.from}</p>
                <p>${flight.to}</p>
                <p>${flight.departure}</p>
                <p>${flight.arrival}</p>
                <p>${flight.by}</p>
            </li>
        `
  );
  output.innerHTML = postsContent.join(" ");
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
