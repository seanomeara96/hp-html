import { useState } from "react";

function boilerPlate(slides) {
  return /*html*/ `
  <style>
  .som-slides__slide {
    display: none;
    -webkit-animation-name: fade;
    -webkit-animation-duration: 1.5s;
    animation-name: fade;
    animation-duration: 1.5s;
  }

  .som-slides__slide--is-visible {
    display: block;
  }

  /* Fading animation */
  @-webkit-keyframes fade {
    from {
      opacity: .4
    }

    to {
      opacity: 1
    }
  }

  @keyframes fade {
    from {
      opacity: .4
    }

    to {
      opacity: 1
    }
  }
</style>
<div class="som-slides">
  ${slides}
</div>
<script type="application/javascript">
  window.addEventListener("DOMContentLoaded", () => {
    const slideShow = document.querySelector(".som-slides");
    const slides = slideShow.querySelectorAll(".som-slides__slide");

    function showSlides(count = 0) {
      slides.forEach(slide => slide.classList.remove("som-slides__slide--is-visible"));
      slides[count].classList.add("som-slides__slide--is-visible");
      count = count < (slides.length - 1) ? count + 1 : 0;
      setTimeout(() => showSlides(count), 10000);
    }
    showSlides();
  })
</script>
  `;
}

function slideString(idx, slideData) {
  const { slideDestination, desktopImageURL, mobileImageURL, altText } =
    slideData;
  return /*html*/ `<!-- slide starts here -->
  <a class="som-slides__slide${
    idx ? " som-slides__slide--is-visible" : ""
  }" href="${slideDestination}">
    <picture style="width: 100%">
      <source srcset="${desktopImageURL}" media="(min-width: 500px)" />
      <img style="width: 100%; object-fit: cover" src="${mobileImageURL}" alt="${altText}" />
    </picture>
  </a>
  <!-- slide ends here -->`;
}

function Slide(props) {
  const { idx, slideData, currentSlide } = props;
  const { slideDestination, desktopImageURL, mobileImageURL, altText } =
    slideData;
  const classes = `som-slides__slide ${
    idx === currentSlide ? " som-slides__slide--is-visible" : ""
  }`;

  return (
    <a className={classes} href={slideDestination}>
      <picture style={{ width: "100%" }}>
        <source
          srcSet={
            desktopImageURL.length
              ? desktopImageURL
              : "https://source.unsplash.com/random/1440x600"
          }
          media="(min-width: 500px)"
        />
        <img
          style={{ width: "100%", objectFit: "cover" }}
          src={
            mobileImageURL.length
              ? mobileImageURL
              : "https://source.unsplash.com/random/415x490"
          }
          alt={altText}
        />
      </picture>
    </a>
  );
}

function fielUpdateHandler(field, event, idx) {
  return (slideData) =>
    slideData.map((c, i) => {
      if (i !== idx) return c;
      const updatedObject = { ...c };
      updatedObject[field] = event.target.value;
      return updatedObject;
    });
}

function SlideForm({ idx, data, updateHandler }) {
  return (
    <form
      className="ui form card"
      style={{
        maxWidth: "600px",
        padding: "1rem",
      }}
    >
      <h3>Slide #{idx + 1}</h3>
      <div className="field">
        <label>Slide Destination URL</label>
        <input
          placeholder="Where this banner leads to"
          type="text"
          value={data.slideDestination}
          onChange={(e) =>
            updateHandler(fielUpdateHandler("slideDestination", e, idx))
          }
        />
      </div>
      <div className="field">
        <label>Desktop Image URL</label>
        <input
          placeholder="URL for Desktop Image"
          type="text"
          value={data.desktopImageURL}
          onChange={(e) =>
            updateHandler(fielUpdateHandler("desktopImageURL", e, idx))
          }
        />
      </div>
      <div className="field">
        <label>Mobile Image URL</label>
        <input
          placeholder="URL fo Mobile Image"
          type="text"
          value={data.mobileImageURL}
          onChange={(e) =>
            updateHandler(fielUpdateHandler("mobileImageURL", e, idx))
          }
        />
      </div>
      <div className="field">
        <label>Alt Text</label>
        <input
          placeholder="Image Alt Text Goes Here"
          type="text"
          value={data.altText}
          onChange={(e) => updateHandler(fielUpdateHandler("altText", e, idx))}
        />
      </div>
    </form>
  );
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

const initialState = [
  {
    slideDestination: "https://www.caterhire.ie/tableware-hire/",
    mobileImageURL:
      "https://cdn11.bigcommerce.com/s-jqwssthhhd/product_images/uploaded_images/stunning-tableware-rentals-mobile-updated.png",
    altText: "stuning tableware rentals",
    desktopImageURL:
      "https://cdn11.bigcommerce.com/s-jqwssthhhd/product_images/uploaded_images/stunning-tableware-rentals-desktop-updated.png",
  },
  {
    slideDestination: "https://www.caterhire.ie/seasonal-offers/",
    mobileImageURL:
      "https://cdn11.bigcommerce.com/s-jqwssthhhd/product_images/uploaded_images/fabulous-summer-offers-mobile-updated.png",
    altText: "fabulous summer offers",
    desktopImageURL:
      "https://cdn11.bigcommerce.com/s-jqwssthhhd/product_images/uploaded_images/fabulous-summer-offers-desktop-updated.png",
  },
];

function App() {
  const blankSlide = () => ({
    slideDestination: "",
    desktopImageURL: "",
    mobileImageURL: "",
    altText: "",
  });
  const [slideData, setSlideData] = useState(initialState);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slideCount = slideData.length;

  setTimeout(() => {
    setCurrentSlide(currentSlide + 1 < slideCount ? currentSlide + 1 : 0);
  }, 5000);

  return (
    <div>
      <div
        className="ui link cards"
        style={{
          top: "0px",
          width: "100%",
          margin: "0",
          backgroundColor: "#fff",
          padding: "2rem",
          maxHeight: "calc(100% - 6rem)",
          display: "grid",
          gridTemplateRows: "repeat(auto-fit, 1fr)",
          gridTemplateColumns: "repeat(auto-fit, 300px)",
        }}
      >
        {slideData.map((data, idx) => (
          <SlideForm
            idx={idx}
            key={idx}
            data={data}
            updateHandler={setSlideData}
          />
        ))}

        <div
          className="ui card"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem",
          }}
        >
          <button
            onClick={() => setSlideData([...slideData, blankSlide()])}
            className="ui button green"
            style={{ marginTop: "1rem" }}
          >
            Add Slide
          </button>
          <button
            onClick={() =>
              setSlideData(slideData.slice(0, slideData.length - 1))
            }
            className="ui button red"
          >
            Remove Last Slide
          </button>
          <button
            onClick={() =>
              copyTextToClipboard(
                boilerPlate(
                  slideData.map((data, idx) => slideString(idx, data)).join("")
                )
              )
            }
            className="ui button blue"
          >
            Copy Code
          </button>
        </div>
      </div>

      <div className="som-slides">
        {slideData.map((data, idx) => (
          <Slide
            idx={idx}
            currentSlide={currentSlide}
            slideData={data}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
