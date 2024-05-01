import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";
function App() {
  const parentRef = useRef(null);
  const [userData, setUserData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [hoveredItemIndex, setHoveredItemIndex] = useState(-1);

  useEffect(() => {
    fetchUserData();
    parentRef.current.focus();
  }, []);

  const fetchUserData = () => {
    axios
      .get(
        "https://fe-take-home-assignment.s3.us-east-2.amazonaws.com/Data.json"
      )
      .then((res) => {
        setUserData(res?.data);
      });
  };

  useEffect(() => {
    if (searchInput.length > 0) {
      handleSearch(searchInput);
    } else {
      setFilterData([]);
    }
  }, [searchInput]);

  useEffect(() => {
    const h2Elements = document.querySelectorAll("h2");
    const h3Elements = document.querySelectorAll("h3");
    const pElements = document.querySelectorAll("p");

    h2Elements.forEach((el) => applyColorChanges(el, searchInput));
    h3Elements.forEach((el) => applyColorChanges(el, searchInput));
    pElements.forEach((el) => applyColorChanges(el, searchInput));
  }, [filterData]);

  const handleSearch = (text) => {
    const filteredData = userData?.filter(
      (each) =>
        each.name.toLowerCase().includes(text.toLowerCase()) ||
        each.id.toLowerCase().includes(text.toLowerCase()) ||
        each.address.toLowerCase().includes(text.toLowerCase()) ||
        each.pincode.toLowerCase().includes(text.toLowerCase()) ||
        each.items.join().toLowerCase().includes(text.toLowerCase())
    );

    setFilterData(filteredData);
    setHoveredItemIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" && hoveredItemIndex > 0) {
      setHoveredItemIndex((prevIndex) => prevIndex - 1);
    } else if (
      e.key === "ArrowDown" &&
      hoveredItemIndex < filterData.length - 1
    ) {
      setHoveredItemIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleCardHover = (index) => {
    setHoveredItemIndex(index);
  };

  // Function to apply color to substrings
  const applyColorChanges = (element, text) => {
    const textContent = element.textContent.toLowerCase();

    element.innerHTML = textContent.replace(
      new RegExp(text, "i"),
      `<span class="red">${text}</span>`
    );
  };

  useEffect(() => {
    if (hoveredItemIndex !== -1) {
      const parent = parentRef.current;
      const hoveredItem = parent.childNodes[hoveredItemIndex];
      const parentRect = parent.getBoundingClientRect();
      const hoveredRect = hoveredItem.getBoundingClientRect();
      const offsetTop = hoveredRect.top - parentRect.top;
      const offsetBottom = hoveredRect.bottom - parentRect.bottom;

      if (offsetTop < 0) {
        parent.scrollTop += offsetTop;
      } else if (offsetBottom > 0) {
        parent.scrollTop += offsetBottom;
      }
    }
  }, [hoveredItemIndex]);
  return (
    <div
      className=""
      style={{
        margin: "100px",
      }}
    >
      <header className="">
        <input
          type="search"
          style={{
            padding: "10px",
          }}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </header>
      <div
        style={{
          height: "60vh",
          overflowY: "scroll",
        }}
        ref={parentRef}
        className="parent"
        onKeyDown={handleKeyDown}
        tabIndex={0} // makeingg the div focusable for keyboard events
      >
        {filterData?.map((each, index) => (
          <div
            style={{
              margin: "5px",
              padding: "5px",
              border: "1px solid grey",
              borderRadius: "5px",
              width: "500px",
              backgroundColor:
                hoveredItemIndex === index ? "lightblue" : "transparent",
            }}
            key={index + each?.id}
            onMouseEnter={() => {
              handleCardHover(index);
              parentRef.current?.focus();
            }}
            onMouseLeave={() => setHoveredItemIndex(-1)}
          >
            <h2>{each?.id}</h2>
            <h3>{each?.name}</h3>

            {each?.items.join().includes(searchInput) && (
              <p>{`${searchInput} found in items`}</p>
            )}
            <p>{each?.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
