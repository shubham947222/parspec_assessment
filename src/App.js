import React, { useEffect, useRef, useState } from "react";
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
    // parentRef.current.focus();
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

  const highlightSearchInput = (text, searchInput) => {
    return text
      .split(new RegExp(`(${searchInput})`, "gi"))
      .map((part, index) => (
        <span
          key={index}
          className={
            part.toLowerCase() === searchInput.toLowerCase() ? "blue" : ""
          }
        >
          {part}
        </span>
      ));
  };
  const highlightSearchInputInItems = (items, searchInput) => {
    return items.map((item, index) =>
      item.toLowerCase().includes(searchInput.toLowerCase()) ? (
        <li key={index}>
          <span className="blue">{searchInput}</span> found in items
        </li>
      ) : null
    );
  };

  return (
    <div
      style={{
        marginTop: "100px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <input
        type="search"
        width={100}
        style={{
          padding: "10px",
          border: "none",
          width: "70%",
          marginBottom: "20px",
          margin: "0 auto",
          display: "block",
        }}
        onChange={(e) => setSearchInput(e.target.value)}
        autoFocus
        placeholder="Search users by ID, Address, name..."
      />
      {filterData?.length > 0 ? (
        <div
          style={{
            height: "60vh",
            overflowY: "scroll",
            width: "70%",
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
                // width: "50%",
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
              <h2>{highlightSearchInput(each?.id, searchInput)}</h2>
              <h3>{highlightSearchInput(each?.name, searchInput)}</h3>
              <ul>{highlightSearchInputInItems(each?.items, searchInput)}</ul>
              <p>{highlightSearchInput(each?.address, searchInput)}</p>
            </div>
          ))}
        </div>
      ) : searchInput?.length > 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>No User Found</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
