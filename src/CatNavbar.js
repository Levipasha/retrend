import React from "react";
import { Navbar } from "react-bootstrap";
import { categories } from "./resources/Catagories";

// array having titles and items
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useMediaQuery } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function CatNavbar() {
  const [isMobile] = useMediaQuery("(max-width: 480px)");

  return (
    <Navbar bg="light" expand="md" className="mt-1" variant="light">
      <Flex justify="space-between" align="center" w="100%">
        <Box mr={2}>
          {!isMobile && (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Menu"
                icon={<HamburgerIcon />}
              />
              <MenuList>
                <Grid
                  templateColumns={[
                    "repeat(2, auto)",
                    "repeat(3, auto)",
                    "repeat(4, auto)",
                    "repeat(5, auto)",
                  ]}
                >
                  {categories.map((category, index) => (
                    <GridItem key={index}>
                      <MenuItem isDisabled>{category.title}</MenuItem>
                      {category.items.map((subCategory, subIndex) => (
                        <MenuItem key={`${index}-${subIndex}`} as={Link} to={`/${subCategory}`}>
                          {subCategory}
                        </MenuItem>
                      ))}
                      {index !== categories.length - 1 && <Divider />}
                    </GridItem>
                  ))}
                </Grid>
              </MenuList>
            </Menu>
          )}
        </Box>
        <Flex justify="center" align="center" flexWrap="wrap">
          {categories.map((category, index) => (
            <Box key={index} px={3} py={1}>
              <Link to={`/${category.title}`}>{category.title}</Link>
            </Box>
          ))}
        </Flex>
      </Flex>
    </Navbar>
  );
}
