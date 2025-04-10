import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useToast,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { Carousel } from "react-bootstrap";
import CurrencyRupeeTwoToneIcon from "@mui/icons-material/CurrencyRupeeTwoTone";
import { MDBCardImage, MDBCol, MDBRow } from "mdb-react-ui-kit";
import MapComponent from "./MapComponent";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Modallogin from "./Modallogin";
import Loading from "./resources/Loading";
import NotFoundComponent from "./resources/NotFound";
import { initializeRazorpay } from './razorpayUtils';
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareProduct from "./components/ShareProduct";
import StaticMap from './components/StaticMap';
import { FaDirections } from 'react-icons/fa';
import { API_BASE_URL } from "./utils/config"; // Import the API base URL

const PreviewAd = ({auth}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [own, setOwn] = useState();
  const [loading, setLoading] = useState(true);
  const [NotFound, setNotFound] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // for register and login
  const [staticModal, setStaticModal] = useState(false);
  const toggleShow = () => setStaticModal(!staticModal);

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/previewad/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setOwn(response.data.own);
      setData(response.data.product);
      setLoading(false);
    } catch (error) {
      setOwn(false);
      try{
        const notlogedindata = await axios.post(`${API_BASE_URL}/previewad/notloggedin/${id}`);
        setData(notlogedindata.data.product);
        setLoading(false);
      }
      catch(e){
        setLoading(false);
        setNotFound(true); 
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Full data:", data);
    console.log("Vehicle data:", data.vehicleData);
    console.log("Address data:", data.address);
  }, [data]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!authToken || !id) return;
      
      try {
        const response = await axios.get(`https://retrand4.onrender.com/wishlist/check/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setIsInWishlist(response.data.inWishlist);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };
    
    checkWishlistStatus();
  }, [authToken, id]);

  const handlePromoteClick = () => {
    onOpen();
  };

  const handlePromoteConfirm = async () => {
    try {
      console.log("Creating promotion order for product:", id);
      
      // If we're using client-side only integration (no server-side order creation)
      const useClientSideOnly = true; // Set this to true if you only have the key ID
      
      if (useClientSideOnly) {
        // Client-side only integration with just the key ID
        const options = {
          key: "rzp_live_FcuvdvTYCmLf7m", // Your Razorpay Key ID
          amount: 3000, // amount in paise (30 INR) - must be in paise (100 paise = 1 INR)
          currency: "INR",
          name: "OLX Clone",
          description: "Product Promotion Payment for 30 days",
          handler: async function (response) {
            console.log("Payment successful:", response);
            
            try {
              // Update promotion status in the database
              const updateResponse = await axios.post(
                "https://retrand4.onrender.com/update-promotion-status",
                { productId: id },
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );
              
              console.log("Promotion status updated:", updateResponse.data);
              
              // Update local state
              setData({
                ...data,
                isPromoted: true,
                promotionStartDate: new Date(),
                promotionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              });
              
              toast({
                title: "Promotion Successful",
                description: "Your product will be displayed at the top with a 'Best One' label for 30 days.",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
            } catch (error) {
              console.error("Error updating promotion status:", error);
              
              // Even if server update fails, still update UI
              setData({
                ...data,
                isPromoted: true,
                promotionStartDate: new Date(),
                promotionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              });
              
              toast({
                title: "Promotion Partially Successful",
                description: "Payment was successful but there was an issue updating the server. Your product will still be displayed as promoted.",
                status: "warning",
                duration: 5000,
                isClosable: true,
              });
            }
            
            onClose();
          },
          prefill: {
            name: data?.owner || "User",
            email: localStorage.getItem("userEmail") || "",
            contact: "" // Empty string allows user to enter their number
          },
          notes: {
            productId: id,
            productTitle: data.title
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: function() {
              console.log("Payment modal dismissed");
              toast({
                title: "Payment Cancelled",
                description: "You cancelled the payment process.",
                status: "info",
                duration: 3000,
                isClosable: true,
              });
            },
            confirm_close: true, // Ask for confirmation when closing the modal
            escape: true, // Allow closing with ESC key
            animation: true // Enable animations
          },
        };
        
        console.log("Initializing Razorpay with client-side only options");
        
        // Initialize Razorpay
        try {
          await initializeRazorpay(options);
        } catch (error) {
          console.error("Razorpay initialization error:", error);
          toast({
            title: "Payment Failed",
            description: "Could not initialize payment gateway. Please try again later.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
        
        return;
      }
      
      // Server-side integration (requires both key ID and secret)
      // Create Razorpay order
      const orderResponse = await axios.post(
        "https://retrand4.onrender.com/create-promotion-order",
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      console.log("Order created successfully:", orderResponse.data);
      
      const { orderId, amount, currency, keyId } = orderResponse.data;
      
      // Configure Razorpay options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "OLX Clone",
        description: "Product Promotion Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            console.log("Payment successful, verifying payment:", response);
            
            // Verify payment with server
            const verifyResponse = await axios.post(
              "https://retrand4.onrender.com/verify-promotion-payment",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                productId: id,
              },
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
            
            console.log("Payment verified successfully:", verifyResponse.data);
            
            // Update local state
            setData({
              ...data,
              isPromoted: true,
              promotionStartDate: new Date(),
              promotionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
            
            toast({
              title: "Promotion Successful",
              description: "Your product will be displayed at the top with a 'Best One' label for 30 days.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            
            onClose();
          } catch (error) {
            console.error("Payment verification error:", error);
            
            let errorMessage = "There was an issue verifying your payment. Please contact support.";
            
            if (error.response && error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message;
            }
            
            toast({
              title: "Payment Verification Failed",
              description: errorMessage,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        },
        prefill: {
          name: "User",
          email: localStorage.getItem("userEmail") || "",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
              status: "info",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      };
      
      console.log("Initializing Razorpay with options:", { ...options, key: options.key.substring(0, 8) + '...' });
      
      // Initialize Razorpay
      try {
        await initializeRazorpay(options);
      } catch (error) {
        console.error("Razorpay initialization error:", error);
        toast({
          title: "Payment Failed",
          description: "Could not initialize payment gateway. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      
    } catch (error) {
      console.error("Promotion error:", error);
      
      // Display more specific error message
      let errorMessage = "There was an issue creating the promotion order. Please try again.";
      
      if (error.response && error.response.data) {
        console.error("Server error response:", error.response.data);
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        if (error.response.data.error) {
          errorMessage += ` (${error.response.data.error})`;
        }
      }
      
      toast({
        title: "Promotion Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Loading />;
  }
  if (NotFound) {
      return <NotFoundComponent />;
  }

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await axios.delete(`https://retrand4.onrender.com/myads_delete/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setIsRemoving(false);
      toast({
        title: "Ad Removed",
        description: "The ad has been successfully removed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/myads");
    } catch (error) {
      console.error(error);
      setIsRemoving(false);
      toast({
        title: "Error",
        description: "There was an error removing the ad.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleClick = async function(){
    if(auth){
     window.location.href = `/chat/${id}/${data.useremail}`
    }
    else{
    toggleShow();
    }
  }
  const address = data.address?.[0] || {};

  const ProductPics = Object.keys(data)
    .filter((key) => key.startsWith("productpic") && data[key])
    .map((key) => data[key]);

  const createdAt = new Date(data.createdAt);
  const now = new Date();
  // Calculate the time difference in milliseconds
  const timeDiff = now.getTime() - createdAt.getTime();
  // Convert milliseconds to days
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  const handleWishlistToggle = async () => {
    if (!authToken) {
      toggleShow(); // Show login modal if not logged in
      return;
    }

    try {
      setIsWishlistLoading(true);
      
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`https://retrand4.onrender.com/wishlist/remove/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setIsInWishlist(false);
        toast({
          title: "Removed from Wishlist",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add to wishlist
        await axios.post(
          "https://retrand4.onrender.com/wishlist/add",
          { productId: id },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setIsInWishlist(true);
        toast({
          title: "Added to Wishlist",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
        className="mt-3 ms-3"
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to={`/catagory/${data.catagory}`}>
            {data.catagory}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{data.subcatagory}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <MDBRow className="mt-3 mb-3">
        <MDBCol md="8">
          <Card>
            <CardBody>
              <Carousel>
                {data.productpic1 && (
                  <Carousel.Item>
                    <MDBCardImage
                      src={data.productpic1}
                      alt="First slide"
                      className="d-block w-100"
                      style={{ maxHeight: "500px", objectFit: "contain" }}
                    />
                  </Carousel.Item>
                )}
                {data.productpic2 && (
                  <Carousel.Item>
                    <MDBCardImage
                      src={data.productpic2}
                      alt="Second slide"
                      className="d-block w-100"
                      style={{ maxHeight: "500px", objectFit: "contain" }}
                    />
                  </Carousel.Item>
                )}
                {data.productpic3 && (
                  <Carousel.Item>
                    <MDBCardImage
                      src={data.productpic3}
                      alt="Third slide"
                      className="d-block w-100"
                      style={{ maxHeight: "500px", objectFit: "contain" }}
                    />
                  </Carousel.Item>
                )}
              </Carousel>
            </CardBody>
          </Card>
          <Card className="mt-3">
            <CardHeader>
              <Heading size="md">Details</Heading>
            </CardHeader>
            <CardBody>
              <Stack divider={<Divider />} spacing="4">
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Price
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    <CurrencyRupeeTwoToneIcon />
                    {data.price}
                    {data.isPromoted && (
                      <Badge colorScheme="green" ml={2}>
                        Best One
                      </Badge>
                    )}
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Description
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {data.description}
                  </Text>
                </Box>
                {/* Vehicle Details Section */}
                {data.vehicleData && (
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      VEHICLE DETAILS
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      <div className="row">
                        {data.vehicleData.vehicleType && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Type: </span>
                            <span>{data.vehicleData.vehicleType === 'car' ? 'Car' : 'Bike'}</span>
                          </div>
                        )}
                        {data.vehicleData.brand && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Brand: </span>
                            <span>{data.vehicleData.brand}</span>
                          </div>
                        )}
                        {data.vehicleData.model && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Model: </span>
                            <span>{data.vehicleData.model}</span>
                          </div>
                        )}
                        {data.vehicleData.fuelType && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Fuel Type: </span>
                            <span>{data.vehicleData.fuelType.charAt(0).toUpperCase() + data.vehicleData.fuelType.slice(1)}</span>
                          </div>
                        )}
                        {data.vehicleData.year && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Year: </span>
                            <span>{data.vehicleData.year}</span>
                          </div>
                        )}
                        {data.vehicleData.month && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Month: </span>
                            <span>{data.vehicleData.month}</span>
                          </div>
                        )}
                        {data.vehicleData.ownership && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Ownership: </span>
                            <span>{data.vehicleData.ownership} owner</span>
                          </div>
                        )}
                        {data.vehicleData.kmDriven && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">KM Driven: </span>
                            <span>{data.vehicleData.kmDriven}</span>
                          </div>
                        )}
                        {data.vehicleData.color && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Color: </span>
                            <span>{data.vehicleData.color}</span>
                          </div>
                        )}
                        {data.vehicleData.registrationPlace && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Registration: </span>
                            <span>{data.vehicleData.registrationPlace}</span>
                          </div>
                        )}
                        {data.vehicleData.insurance && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Insurance: </span>
                            <span>{data.vehicleData.insurance}</span>
                          </div>
                        )}
                      </div>
                      
                      {data.vehicleData.features && (
                        <>
                          <Divider my={2} />
                          <Heading size="xs" mt={3} mb={2}>ADDITIONAL VEHICLE INFORMATION:</Heading>
                          <div className="row">
                            {data.vehicleData.features.abs !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">ABS: </span>
                                <span>{data.vehicleData.features.abs ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.accidental !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Accidental: </span>
                                <span>{data.vehicleData.features.accidental ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.adjustableMirror !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Adjustable External Mirror: </span>
                                <span>{data.vehicleData.features.adjustableMirror ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.adjustableSteering !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Adjustable Steering: </span>
                                <span>{data.vehicleData.features.adjustableSteering ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.airConditioning !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Air Conditioning: </span>
                                <span>{data.vehicleData.features.airConditioning ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.airbags && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Number of Airbags: </span>
                                <span>{data.vehicleData.features.airbags} airbags</span>
                              </div>
                            )}
                            {data.vehicleData.features.alloyWheels !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Alloy Wheels: </span>
                                <span>{data.vehicleData.features.alloyWheels ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.bluetooth !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Bluetooth: </span>
                                <span>{data.vehicleData.features.bluetooth ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.cruiseControl !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Cruise Control: </span>
                                <span>{data.vehicleData.features.cruiseControl ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.parkingSensors !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Parking Sensors: </span>
                                <span>{data.vehicleData.features.parkingSensors ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.powerSteering !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Power Steering: </span>
                                <span>{data.vehicleData.features.powerSteering ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.powerWindows !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Power Windows: </span>
                                <span>{data.vehicleData.features.powerWindows ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.rearCamera !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Rear Parking Camera: </span>
                                <span>{data.vehicleData.features.rearCamera ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </Text>
                  </Box>
                )}
                
                {/* Category Data Section */}
                {data.categoryData && Object.keys(data.categoryData).length > 0 && (
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      {data.categoryData.type === "book" ? "BOOK DETAILS" : 
                       data.categoryData.type === "electronics" ? "ELECTRONICS DETAILS" :
                       data.categoryData.type === "furniture" ? "FURNITURE DETAILS" :
                       data.categoryData.type === "property" ? "PROPERTY DETAILS" :
                       data.categoryData.type === "mobile" ? "MOBILE DETAILS" :
                       data.categoryData.type === "fashion" ? "FASHION DETAILS" :
                       data.categoryData.type === "job" ? "JOB DETAILS" :
                       data.categoryData.type === "sports_hobbies" ? "SPORTS & HOBBIES DETAILS" :
                       data.categoryData.type === "pet" ? "PET DETAILS" : "DETAILS"}
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      <div className="row">
                        {/* Dynamic display of category-specific fields */}
                        {Object.entries(data.categoryData).map(([key, value]) => {
                          // Skip the type field since we use it for the heading
                          if (key === 'type') return null;
                          
                          // Format the key for display
                          const formattedKey = key.replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase())
                            .replace(/([a-z])([A-Z])/g, '$1 $2');
                          
                          // Format boolean values
                          let displayValue = value;
                          if (typeof value === 'boolean') {
                            displayValue = value ? 'Yes' : 'No';
                          }
                          
                          return (
                            <div className="col-md-6 mb-2" key={key}>
                              <span className="text-muted">{formattedKey}: </span>
                              <span>{displayValue}</span>
                            </div>
                          );
                        })}
                      </div>
                    </Text>
                  </Box>
                )}
              </Stack>
            </CardBody>
          </Card>
        </MDBCol>
        <MDBCol md="4">
          <Card>
            <CardHeader>
              <Heading size="md">Seller Information</Heading>
            </CardHeader>
            <CardBody>
              <Flex>
                <Image
                  borderRadius="full"
                  boxSize="50px"
                  src={data.ownerpicture}
                  alt={data.owner}
                  mr="12px"
                />
                <Stack>
                  <Heading size="sm">{data.owner}</Heading>
                  <Text>Member since 2023</Text>
                </Stack>
              </Flex>
            </CardBody>
            <CardFooter>
              {own ? (
                <Flex width="100%" justifyContent="space-between">
                  <Button
                    colorScheme="red"
                    onClick={handleRemove}
                    isLoading={isRemoving}
                  >
                    Remove Ad
                  </Button>
                  {!data.isPromoted && (
                    <Button
                      colorScheme="green"
                      onClick={handlePromoteClick}
                    >
                      Promote Ad
                    </Button>
                  )}
                </Flex>
              ) : (
                <Flex width="100%" justifyContent="space-between">
                  <Button
                    colorScheme="blue"
                    width="60%"
                    onClick={authToken ? handleClick : toggleShow}
                  >
                    Chat with Seller
                  </Button>
                  <ShareProduct productId={id} title={data.title} />
                  <Button
                    variant="solid"
                    size="md"
                    colorScheme={isInWishlist ? "red" : "pink"}
                    onClick={handleWishlistToggle}
                    isLoading={isWishlistLoading}
                    width="15%"
                  >
                    {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </Button>
                </Flex>
              )}
            </CardFooter>
          </Card>
          <Card className="mt-3">
            <CardHeader>
              <Heading size="md">Posted in</Heading>
            </CardHeader>
            <CardBody>
              <Text>
                {data.address && data.address[0] && data.address[0].area},{" "}
                {data.address && data.address[0] && data.address[0].city},{" "}
                {data.address && data.address[0] && data.address[0].state},{" "}
                {data.address && data.address[0] && data.address[0].postcode}
              </Text>
              <MapComponent 
                location={{
                  lat: data.latitude || (data.address && data.address[0] ? data.address[0].latitude : null),
                  lng: data.longitude || (data.address && data.address[0] ? data.address[0].longitude : null)
                }} 
              />
            </CardBody>
          </Card>
        </MDBCol>
      </MDBRow>

      {/* Promotion Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Promote Your Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Promote your product for ₹30 to make it appear at the top of search results with a "Best One" label for 30 days.
            </Text>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">{data.title}</Text>
              <Text>Price: ₹{data.price}</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePromoteConfirm}>
              Pay ₹30
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {staticModal && <Modallogin toggleShow={toggleShow} />}
    </div>
  );
};

export default PreviewAd;
