import React, { useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBSelect,
  MDBRadio,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import {
  FormControl,
  FormLabel,
  Select,
  RadioGroup,
  Stack,
  Heading,
  Divider,
  SimpleGrid,
  Box,
  Checkbox,
  Input
} from '@chakra-ui/react';

// Data for Indian cars and their models
const indianCarsData = {
  "Maruti Suzuki": ["Swift", "Baleno", "Dzire", "Alto", "Brezza", "Ertiga", "WagonR", "Celerio"],
  "Hyundai": ["i10", "i20", "Creta", "Venue", "Verna", "Aura", "Alcazar", "Tucson"],
  "Tata Motors": ["Nexon", "Tiago", "Altroz", "Harrier", "Safari", "Punch", "Tigor", "Hexa"],
  "Mahindra": ["Scorpio", "XUV700", "XUV300", "Thar", "Bolero", "Marazzo", "KUV100", "XUV500"],
  "Honda": ["City", "Amaze", "WR-V", "Jazz", "Civic", "CR-V"],
  "Toyota": ["Innova", "Fortuner", "Glanza", "Urban Cruiser", "Camry", "Vellfire"],
  "Kia": ["Seltos", "Sonet", "Carens", "Carnival"],
  "MG": ["Hector", "Astor", "ZS EV", "Gloster"],
  "Skoda": ["Kushaq", "Slavia", "Octavia", "Superb", "Kodiaq"],
  "Volkswagen": ["Taigun", "Virtus", "Polo", "Vento", "Tiguan"]
};

// Data for Indian bikes and their models
const indianBikesData = {
  "Hero": ["Splendor", "HF Deluxe", "Passion", "Glamour", "Xtreme", "Xpulse", "Destini", "Pleasure"],
  "Bajaj": ["Pulsar", "Platina", "CT", "Avenger", "Dominar", "Chetak"],
  "TVS": ["Apache", "Jupiter", "XL100", "Ntorq", "Raider", "iQube", "Sport", "Star City"],
  "Honda": ["Activa", "Shine", "Unicorn", "SP", "Dio", "Hornet", "CB", "Livo"],
  "Royal Enfield": ["Classic", "Bullet", "Meteor", "Himalayan", "Continental GT", "Interceptor", "Hunter"],
  "Yamaha": ["FZ", "R15", "MT", "Fascino", "RayZR", "FZS", "Aerox"],
  "Suzuki": ["Access", "Burgman", "Gixxer", "Avenis", "Hayabusa", "V-Strom"],
  "KTM": ["Duke", "RC", "Adventure", "390", "250", "200", "125"],
  "Jawa": ["Jawa", "42", "Perak", "42 Bobber"],
  "Triumph": ["Street Triple", "Tiger", "Trident", "Rocket", "Speed Triple"]
};

export default function VehicleSelector({ onVehicleSelect }) {
  const [vehicleType, setVehicleType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [fuelType, setFuelType] = useState("petrol");
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  
  // Additional vehicle details
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [ownership, setOwnership] = useState("1st");
  const [kmDriven, setKmDriven] = useState("");
  const [color, setColor] = useState("");
  const [registrationPlace, setRegistrationPlace] = useState("");
  const [insurance, setInsurance] = useState("Comprehensive");
  
  // Features
  const [abs, setAbs] = useState(false);
  const [accidental, setAccidental] = useState(false);
  const [adjustableMirror, setAdjustableMirror] = useState(false);
  const [adjustableSteering, setAdjustableSteering] = useState(false);
  const [airConditioning, setAirConditioning] = useState(false);
  const [airbags, setAirbags] = useState("0");
  const [alloyWheels, setAlloyWheels] = useState(false);
  const [bluetooth, setBluetooth] = useState(false);
  const [cruiseControl, setCruiseControl] = useState(false);
  const [parkingSensors, setParkingSensors] = useState(false);
  const [powerSteering, setPowerSteering] = useState(false);
  const [powerWindows, setPowerWindows] = useState(false);
  const [rearCamera, setRearCamera] = useState(false);

  useEffect(() => {
    // Set available brands based on vehicle type
    if (vehicleType === "car") {
      setAvailableBrands(Object.keys(indianCarsData));
    } else if (vehicleType === "bike") {
      setAvailableBrands(Object.keys(indianBikesData));
    } else {
      setAvailableBrands([]);
    }
    
    // Reset brand and model when vehicle type changes
    setBrand("");
    setModel("");
  }, [vehicleType]);

  useEffect(() => {
    // Set available models based on selected brand and vehicle type
    if (vehicleType === "car" && brand) {
      setAvailableModels(indianCarsData[brand] || []);
    } else if (vehicleType === "bike" && brand) {
      setAvailableModels(indianBikesData[brand] || []);
    } else {
      setAvailableModels([]);
    }
    
    // Reset model when brand changes
    setModel("");
  }, [brand, vehicleType]);

  useEffect(() => {
    // Pass vehicle data to parent component
    onVehicleSelect({
      vehicleType,
      brand,
      model,
      fuelType,
      year,
      month,
      ownership,
      kmDriven,
      color,
      registrationPlace,
      insurance,
      features: {
        abs,
        accidental,
        adjustableMirror,
        adjustableSteering,
        airConditioning,
        airbags,
        alloyWheels,
        bluetooth,
        cruiseControl,
        parkingSensors,
        powerSteering,
        powerWindows,
        rearCamera
      }
    });
  }, [
    vehicleType, brand, model, fuelType, year, month, ownership, 
    kmDriven, color, registrationPlace, insurance, abs, accidental,
    adjustableMirror, adjustableSteering, airConditioning, airbags,
    alloyWheels, bluetooth, cruiseControl, parkingSensors, powerSteering,
    powerWindows, rearCamera, onVehicleSelect
  ]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="mt-3 mb-3">
      <MDBCard>
        <MDBCardBody>
          <Heading size="md" mb={4}>Vehicle Details</Heading>
          
          <FormControl mb={4}>
            <FormLabel>Vehicle Type</FormLabel>
            <Select 
              placeholder="Select vehicle type" 
                value={vehicleType} 
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
            </Select>
          </FormControl>

          {vehicleType && (
            <>
              <FormControl mb={4}>
                <FormLabel>Brand</FormLabel>
                <Select 
                  placeholder="Select brand" 
                    value={brand} 
                    onChange={(e) => setBrand(e.target.value)}
                  >
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </Select>
              </FormControl>

              {brand && (
                <FormControl mb={4}>
                  <FormLabel>Model</FormLabel>
                  <Select 
                    placeholder="Select model" 
                      value={model} 
                      onChange={(e) => setModel(e.target.value)}
                    >
                    {availableModels.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </Select>
                </FormControl>
              )}

              {vehicleType === "car" && (
                <FormControl mb={4}>
                  <FormLabel>Fuel Type</FormLabel>
                  <RadioGroup value={fuelType} onChange={setFuelType}>
                    <Stack direction="row">
                      <MDBRadio value="petrol" name="fuelType" id="petrol" label="Petrol" />
                      <MDBRadio value="diesel" name="fuelType" id="diesel" label="Diesel" />
                      <MDBRadio value="cng" name="fuelType" id="cng" label="CNG" />
                      <MDBRadio value="electric" name="fuelType" id="electric" label="Electric" />
                      <MDBRadio value="hybrid" name="fuelType" id="hybrid" label="Hybrid" />
                    </Stack>
                  </RadioGroup>
                </FormControl>
              )}
              
              <Divider my={4} />
              
              <Heading size="sm" mb={4}>Additional Information</Heading>
              
              <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                <FormControl>
                  <FormLabel>Year</FormLabel>
                  <Select 
                    placeholder="Select year" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Month</FormLabel>
                  <Select 
                    placeholder="Select month" 
                    value={month} 
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Ownership</FormLabel>
                  <Select 
                    value={ownership} 
                    onChange={(e) => setOwnership(e.target.value)}
                  >
                    <option value="1st">1st owner</option>
                    <option value="2nd">2nd owner</option>
                    <option value="3rd">3rd owner</option>
                    <option value="4th">4th owner or more</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>KM Driven</FormLabel>
                  <Input 
                    type="number" 
                    value={kmDriven} 
                    onChange={(e) => setKmDriven(e.target.value)}
                    placeholder="e.g. 25000"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Color</FormLabel>
                  <Input 
                    type="text" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. White"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Registration Place</FormLabel>
                  <Input 
                    type="text" 
                    value={registrationPlace} 
                    onChange={(e) => setRegistrationPlace(e.target.value)}
                    placeholder="e.g. TN"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Insurance</FormLabel>
                  <Select 
                    value={insurance} 
                    onChange={(e) => setInsurance(e.target.value)}
                  >
                    <option value="Comprehensive">Comprehensive</option>
                    <option value="Third Party">Third Party</option>
                    <option value="Zero Dep">Zero Dep</option>
                    <option value="Expired">Expired</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              
              <Divider my={4} />
              
              <Heading size="sm" mb={4}>Features</Heading>
              
              <SimpleGrid columns={[2, 3, 4]} spacing={4}>
                <Checkbox isChecked={abs} onChange={(e) => setAbs(e.target.checked)}>
                  ABS
                </Checkbox>
                
                <Checkbox isChecked={accidental} onChange={(e) => setAccidental(e.target.checked)}>
                  Accidental
                </Checkbox>
                
                {vehicleType === "car" && (
                  <>
                    <Checkbox isChecked={adjustableMirror} onChange={(e) => setAdjustableMirror(e.target.checked)}>
                      Adjustable Mirrors
                    </Checkbox>
                    
                    <Checkbox isChecked={adjustableSteering} onChange={(e) => setAdjustableSteering(e.target.checked)}>
                      Adjustable Steering
                    </Checkbox>
                    
                    <Checkbox isChecked={airConditioning} onChange={(e) => setAirConditioning(e.target.checked)}>
                      Air Conditioning
                    </Checkbox>
                    
                    <Box>
                      <FormLabel fontSize="sm">Airbags</FormLabel>
                      <Select 
                        size="sm"
                        value={airbags} 
                        onChange={(e) => setAirbags(e.target.value)}
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="6+">6+</option>
                      </Select>
                    </Box>
                    
                    <Checkbox isChecked={cruiseControl} onChange={(e) => setCruiseControl(e.target.checked)}>
                      Cruise Control
                    </Checkbox>
                    
                    <Checkbox isChecked={powerWindows} onChange={(e) => setPowerWindows(e.target.checked)}>
                      Power Windows
                    </Checkbox>
                  </>
                )}
                
                <Checkbox isChecked={alloyWheels} onChange={(e) => setAlloyWheels(e.target.checked)}>
                  Alloy Wheels
                </Checkbox>
                
                <Checkbox isChecked={bluetooth} onChange={(e) => setBluetooth(e.target.checked)}>
                  Bluetooth
                </Checkbox>
                
                {vehicleType === "car" && (
                  <Checkbox isChecked={parkingSensors} onChange={(e) => setParkingSensors(e.target.checked)}>
                    Parking Sensors
                  </Checkbox>
                )}
                
                {vehicleType === "car" && (
                  <Checkbox isChecked={powerSteering} onChange={(e) => setPowerSteering(e.target.checked)}>
                    Power Steering
                  </Checkbox>
                )}
                
                {vehicleType === "car" && (
                  <Checkbox isChecked={rearCamera} onChange={(e) => setRearCamera(e.target.checked)}>
                    Rear Camera
                  </Checkbox>
                )}
              </SimpleGrid>
            </>
          )}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}