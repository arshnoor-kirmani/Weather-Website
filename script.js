let weatherBody, citesBody, settingBody, settingUnitsBtns;
// ====================================================== NavBar Button's Logic============================================================
weatherBody = document.querySelector(".weather-box");
citesBody = document.querySelector(".cites-seciton");
settingBody = document.querySelector(".setting-section");
function weathershow() {
  weatherBody.classList.remove("displaynone");
  citesBody.classList.add("displaynone");
  settingBody.classList.add("displaynone");
  document.querySelector(".right").classList.remove("displaynone");
}
function citesshow() {
  citesBody.classList.remove("displaynone");
  weatherBody.classList.add("displaynone");
  settingBody.classList.add("displaynone");
  document.querySelector(".right").classList.remove("displaynone");
}
function settingshow() {
  settingBody.classList.remove("displaynone");
  document.querySelector(".right").classList.add("displaynone");
}
// ====================================================== Setting Uints Button's Logic======================================================
settingUnitsBtns = document.querySelectorAll(".menus");
settingUnitsBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll(`.${e.target.classList[1]}`).forEach((e) => {
      e.classList.remove("selected");
    });
    e.target.classList.add("selected");
  });
});
