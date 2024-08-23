let inputField = document.querySelector(".search");
inputField.addEventListener("click", () => {
  citesshow();
});
async function fetchCityInfo() {
  const url = "./contryData/cities.json";

  try {
    const response = await fetch(url);
    const result = await response.json();

    searchInputRelatedData(result);
  } catch (error) {
    console.error(error);
  }
}
fetchCityInfo();
function searchInputRelatedData(result) {
  inputField.addEventListener("input", (e) => {
    inputField.addEventListener("keydown", function () {
      clearTimeout(typingTimer);
    });
    typingTimer = setTimeout(() => {
      let serc = e.target.value;
      console.log(serc, typeof serc);

      let DataArr = result.filter((e) => e.name.includes(serc));
      console.log(DataArr);
    }, 600);
  });
}
