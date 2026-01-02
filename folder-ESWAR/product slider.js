function updateSlides(box){
  let slides = box.querySelectorAll(".p-slides img");
  let index = parseInt(box.dataset.index || 0);

  slides.forEach((img,i)=>{
    img.style.transform = `translateX(${(i-index)*100}%)`;
  });
}

function nextProd(btn){
  let box = btn.closest(".prod-slider");
  let slides = box.querySelectorAll(".p-slides img");
  let index = parseInt(box.dataset.index || 0);

  index = (index + 1) % slides.length;
  box.dataset.index = index;

  updateSlides(box);
}

function prevProd(btn){
  let box = btn.closest(".prod-slider");
  let slides = box.querySelectorAll(".p-slides img");
  let index = parseInt(box.dataset.index || 0);

  index = (index - 1 + slides.length) % slides.length;
  box.dataset.index = index;

  updateSlides(box);
}

// set initial positions
document.querySelectorAll(".prod-slider").forEach(updateSlides);

// IMAGE PREVIEW
function openPreview(src){
  document.getElementById("previewImg").src = src;
  document.getElementById("previewBox").style.display="flex";
}

document.getElementById("previewBox").onclick = ()=>{
  document.getElementById("previewBox").style.display="none";
};
