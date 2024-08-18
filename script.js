document.querySelector(".cites").addEventListener("click", () => {
  document.querySelector(".cites-seciton").style.display = "grid";
  document.querySelector(".weather-box").style.display = "none";
});
document.querySelector(".weather").addEventListener("click", () => {
  document.querySelector(".cites-seciton").style.display = "none";
  document.querySelector(".weather-box").style.display = "grid";
});
