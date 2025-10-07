import { Box, Typography, Toolbar, ListItem, List, ListItemText } from "@mui/material";
import { useState, useEffect } from "react";
import { getData } from "../../../helper/read_data";

export function Packages() {
  const [data, setData] = useState<string[][]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getData();
        setData(result);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    fetchData();
  }, []); // runs once when component mounts

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Toolbar />
      <Typography>Packages</Typography>
      <Box>
        <List>
        {data.map((item, outerIdx) => (
          <ul key={`category-${outerIdx}-${item[0]}`}>
              {item.map((pkg, innerIdx) => (
                <li key={`${outerIdx}-${innerIdx}-${pkg}`} style={{fontWeight: innerIdx == 0 ? "bold" : "normal"}}>{pkg}</li>
              ))}
          </ul>
        ))}
      </List>
      </Box>
    </Box>
  );
}
