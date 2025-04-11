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
  IconButton,
  Avatar,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar({ auth, setAuth }) {
  const navigate = useNavigate();
  const [showNavNoTogglerSecond, setShowNavNoTogglerSecond] = useState(false);
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
    localStorage.clear();
    setAuth(false);
    window.location.href = "/";
  }

  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const address = response.data.address;
      const displayName = address.suburb || address.city || address.state || "India";
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
        displayName: [
          location.address.suburb || location.address.neighbourhood,
          location.address.city || location.address.town,
          location.address.state
        ].filter(Boolean).join(", "),
        coordinates: {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
        },
      }));
      setLocationSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);
    fetchLocationSuggestions(e.target.value);
  };

  const handleSuggestionSelect = (suggestion) => {
    setCurrentLocation(suggestion.displayName);
    setSearchQuery(suggestion.displayName);
    setIsSearching(false);
    setLocationSuggestions([]);
    localStorage.setItem("userLocation", JSON.stringify({
      name: suggestion.displayName,
      coordinates: suggestion.coordinates
    }));
    window.dispatchEvent(new Event("locationChanged"));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearching(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <MDBNavbar expand="lg" style={{ backgroundColor: "rgba(235, 238, 239, 1)" }}>
      <MDBContainer fluid className="d-flex align-items-center justify-content-between">
        {/* LOGO */}
        <MDBNavbarBrand href="/" className="d-flex flex-column">
          <span style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            RETREND
          </span>
          <span style={{ fontSize: "14px", color: "#666" }}>
            Revive. Reimagine.
          </span>
        </MDBNavbarBrand>

        {/* LOCATION */}
        <Box position="relative" width="250px" ref={searchRef}>
          <Button
            onClick={() => setIsSearching(true)}
            leftIcon={<MDBIcon fas icon="map-marker-alt" />}
            bg="white"
            color="black"
            _hover={{ bg: "gray.50" }}
            borderRadius="md"
            width="100%"
            justifyContent="flex-start"
            border="1px solid"
            borderColor="gray.200"
          >
            {currentLocation}
          </Button>

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
              mt={2}
            >
              <Input
                placeholder="Search location"
                value={searchQuery}
                onChange={handleSearchInput}
                border="none"
                borderBottom="1px solid"
                borderColor="gray.200"
                p={4}
                autoFocus
              />
              <Box maxH="300px" overflowY="auto">
                <List>
                  <ListItem
                    p={3}
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            const { latitude, longitude } = position.coords;
                            setCoordinates({ lat: latitude, lng: longitude });
                            fetchLocationName(latitude, longitude);
                          },
                          () => {
                            setCurrentLocation("India");
                          }
                        );
                      }
                      setIsSearching(false);
                    }}
                  >
                    <Flex align="center">
                      <MDBIcon fas icon="location-arrow" className="me-2" />
                      Use current location
                    </Flex>
                  </ListItem>
                  {locationSuggestions.map((s, idx) => (
                    <ListItem
                      key={idx}
                      p={3}
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                      onClick={() => handleSuggestionSelect(s)}
                    >
                      {s.displayName}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
        </Box>

        {/* SEARCH BAR */}
        <Input
          placeholder="Search products..."
          width="300px"
          ml={4}
          borderRadius="md"
          borderColor="gray.300"
        />

        {/* SELL BUTTON */}
        <Button
          onClick={() => navigate("/post")}
          colorScheme="blue"
          ml={4}
        >
          + Sell
        </Button>

        {/* LOGIN / LOGOUT */}
        {auth ? (
          <Flex align="center" ml={4} gap={2}>
            <Avatar
              src={localStorage.getItem("authpicture")}
              name={localStorage.getItem("authname")}
              size="sm"
            />
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </Flex>
        ) : (
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            ml={4}
          >
            Login
          </Button>
        )}

        {/* WISHLIST */}
        <IconButton
          icon={<MDBIcon fas icon="heart" />}
          onClick={() => navigate("/wishlist")}
          variant="ghost"
          ml={2}
        />
      </MDBContainer>
    </MDBNavbar>
  );
}
