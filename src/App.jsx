import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import Photo from "./components/Photo";
import { base, key } from "./components/ApiKeys";
function App() {
  const [loading, setLoading] = useState(false); //Loading
  const [photos, setPhotos] = useState([]); //Photos
  const [page, setPage] = useState(1); //page
  const [query, setQuery] = useState(""); //query

  const fetchImages = async () => {
    setLoading(true);
    let url;
    let urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    if (query) {
      url = ` ${base}search/photos?client_id=${key}${urlPage}${urlQuery}`;
    } else {
      url = `${base}photos/?client_id=${key}${urlPage}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhoto) => {
        if (query && page == 1) {
          return data.results;
        } else if (query) {
          return [...oldPhoto, ...data.results];
        } else {
          return [...oldPhoto, ...data];
        }
      });
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if (
        (!loading && window.innerHeight + window.scrollY) >=
        document.body.scrollHeight - 2
      ) {
        setPage((oldPage) => {
          return oldPage + 1;
        });
      }
    });
    return () => window.removeEventListener("scroll", event);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages();
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setPage(1);
      fetchImages();
    }
  };

  return (
    <>
      <main>
        <section className="search">
          <form className="search-form">
            <div className="logo">
              <span>Image</span> <span>Hub</span>
            </div>
            <div className="submit">
              <input
                type="text"
                placeholder="Search"
                className="form-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <FaSearch onClick={handleSubmit} className="submit-btn" />
            </div>
          </form>
        </section>
        <section className="photos">
          <div className="photos-center">
            {photos.map((image, index) => {
              return <Photo key={index} {...image} />;
            })}
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
