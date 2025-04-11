import React, { useState, useEffect, useRef } from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBIcon,
} from "mdb-react-ui-kit";
import {
  Button,
  Box,
  Text,
  Input,
  List,
  ListItem,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";

export default function Navbar({ auth, setAuth }) {
  const [showNavNoTogglerSecond, setShowNavNoTogglerSecond] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [staticModal, setStaticModal] = useState(false);
  const toggleShow = () => setStaticModal(!staticModal);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("India");
  const [coordinates, setCoordinates] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (!auth) return;
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("https://retrand4.onrender.com/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishlistItems(response.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
    fetchWishlistCount();
  }, [auth]);

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authemail");
    localStorage.removeItem("authname");
    localStorage.removeItem("authpicture");
    localStorage.removeItem("authphone");
    window.location.href = "/";
    setAuth(false);
  }

  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const addressParts = response.data.address;
      const address = {
        area: addressParts.suburb || addressParts.neighbourhood || addressParts.residential,
        city: addressParts.city || addressParts.town || addressParts.municipality,
        state: addressParts.state,
        postcode: addressParts.postcode
      };
      const displayName = address.area || address.city || address.state;
      setCurrentLocation(displayName);
      localStorage.setItem("userLocation", JSON.stringify({
        name: displayName,
        address,
        coordinates: { lat, lng }
      }));
      window.dispatchEvent(new Event("locationChanged"));
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  const fetchLocationSuggestions = async (query) => {
    if (!query.trim()) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5&countrycodes=in`
      );
      const suggestions = response.data.map((location) => ({
        area: location.address.suburb || location.address.neighbourhood || location.address.residential,
        city: location.address.city || location.address.town || location.address.municipality,
        state: location.address.state,
        displayName: [
          location.address.suburb || location.address.neighbourhood || location.address.residential,
          location.address.city || location.address.town || location.address.municipality,
          location.address.state
        ].filter(Boolean).join(", "),
        coordinates: {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
        },
      }));
      setLocationSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setIsSearching(true);
    fetchLocationSuggestions(value);
  };

  const handleSuggestionSelect = (suggestion) => {
    const displayName = [suggestion.area, suggestion.city, suggestion.state]
      .filter(Boolean)
      .join(", ");
    setCurrentLocation(displayName);
    setSearchQuery(displayName);
    setIsSearching(false);
    setLocationSuggestions([]);
    localStorage.setItem("userLocation", JSON.stringify({
      name: displayName,
      address: {
        area: suggestion.area,
        city: suggestion.city,
        state: suggestion.state
      },
      coordinates: suggestion.coordinates
    }));
    window.dispatchEvent(new Event("locationChanged"));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getProducts = async () => {
    try {
      const savedLocation = localStorage.getItem("userLocation");
      const locationData = savedLocation ? JSON.parse(savedLocation) : null;
      const response = await axios.get("https://retrand4.onrender.com/getProducts", {
        params: {
          location: locationData?.name || "India",
        },
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const LocationButton = () => (
    <Button
      onClick={() => setIsSearching(true)}
      leftIcon={<MDBIcon fas icon="map-marker-alt" />}
      bg="white"
      color="black"
      _hover={{ bg: "gray.50" }}
      borderRadius="md"
      width="250px"
      display="flex"
      justifyContent="flex-start"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      border="1px solid"
      borderColor="gray.200"
    >
      {currentLocation}
    </Button>
  );

  return (
    <MDBNavbar expand="lg" style={{ backgroundColor: "rgba(235, 238, 239, 1)" }}>
      <MDBContainer fluid>
        <MDBNavbarBrand href="/" className="d-flex flex-column">
          <span style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            RETREND
          </span>
          <span style={{ fontSize: "14px", color: "#666" }}>
            Revive. Reimagine.
          </span>
        </MDBNavbarBrand>

        <div className="d-flex align-items-center" style={{ marginLeft: "20px" }} ref={searchRef}>
          <Box position="relative" width="250px">
            <LocationButton />
            {isSearching && (
              <Box
                position="absolute"
                top="100%"
                left="0"
                right="0"
                bg="white"
                boxShadow="lg"
                borderRadius="md"
                zIndex={1000}
                border="1px solid"
                borderColor="gray.200"
                mt={2}
              >
                <Input
                  placeholder="Search city, area or locality"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  border="none"
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  borderRadius="0"
                  p={4}
                  autoFocus
                />

                <Box maxH="400px" overflowY="auto">
                  <List>
                    <ListItem
                      p={3}
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                      onClick={() => {
                        if (navigator.geolocation) {
                          setCurrentLocation("Detecting location...");
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              const { latitude, longitude } = position.coords;
                              setCoordinates({ lat: latitude, lng: longitude });
                              fetchLocationName(latitude, longitude);
                            },
                            (error) => {
                              console.error("Error:", error);
                              setCurrentLocation("India");
                              localStorage.setItem("userLocation", JSON.stringify({
                                name: "India",
                                coordinates: null,
                              }));
                            }
                          );
                        }
                        setIsSearching(false);
                      }}
                    >
                      <Flex align="center" color="gray.700">
                        <MDBIcon fas icon="location-arrow" className="me-2" />
                        <Text fontWeight="500">Use current location</Text>
                      </Flex>
                    </ListItem>

                    {locationSuggestions.map((suggestion, index) => (
                      <ListItem
                        key={index}
                        p={3}
                        cursor="pointer"
                        bg={currentLocation === suggestion.displayName ? "gray.50" : "white"}
                        _hover={{ bg: "gray.100" }}
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        {suggestion.displayName}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            )}
          </Box>
        </div>
      </MDBContainer>
    </MDBNavbar>
  );
}
